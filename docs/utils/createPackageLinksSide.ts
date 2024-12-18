import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { consola } from 'consola'
import type { DefaultTheme } from 'vitepress'

export interface LinkInfo {
  dirLevelName: string[] // dir level, eg: elements-v3/components/button/index.md, ['components', 'button']
  linkPath: string
  targetPath: string
  routeLink: string
}
export interface UserSidebarVip extends DefaultTheme.SidebarItem {
  items?: UserSidebarVip[]
  _targetPath?: string
}

const PACKAGE_INDEX_TEXT = 'overview'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const docsDir = path.resolve(__dirname, '..')
const rootDir = path.resolve(__dirname, '../..')
const packagesDir = path.resolve(rootDir, 'packages')

export const isWindows
  = typeof process !== 'undefined' && process.platform === 'win32'
const windowsSlashRE = /\\/g
export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/')
}
export function normalizePath(id) {
  return path.posix.normalize(isWindows ? slash(id) : id)
}

export function createDefaultLink(linkInfo: LinkInfo) {
  const { linkPath, targetPath } = linkInfo
  fs.mkdirSync(path.dirname(linkPath), { recursive: true })
  fs.symlinkSync(targetPath, linkPath)
}

// console.log(JSON.stringify(await createPackageLinksSide('element-v3'), null, 2));
// console.log(JSON.stringify(createPackageLinksSide('element-v3', createDefaultLink), null, 2));

export async function packageIndexMd(packageName: string) {
  const allSideBar = await createPackageLinksSide(packageName)
  const indexItem = allSideBar.find(item => item.text === PACKAGE_INDEX_TEXT)
  if (!indexItem) {
    consola.error(`createSideBars: packageIndexMd not found, ${packageName} -> indexSidebar not found`)
    return []
  }
  return [indexItem]
}

export async function packageCategoryMds(packageName: string, cate: string) {
  const allSideBar = await createPackageLinksSide(packageName)
  const cateItems = allSideBar.find(item => item.text === cate)
  if (!cateItems) {
    consola.error(`createSideBars: packageCategoryMds not found, ${packageName} -> ${cate} not found.`)
    return []
  }
  return cateItems.items || []
}

/**
 * create links for docs,
 * like:
 *     :pkg/:catogery/xxx.md -> docs/:pkg/:catogery/xxx.md
 *     :pkg/:catogery/dir/index.md -> docs/:pkg/:catogery/xxx.md
 * note: directory name conflict with file name, eg: docs/pkg/xxx/index.md -> docs/pkg/xxx.md
 *
 * @param pkgName
 * @returns
 */
export async function createPackageLinksSide(pkgName: string, filePathHandler?: (info: LinkInfo) => void): Promise<UserSidebarVip[]> {
  const pkgResolvePath = path.resolve(packagesDir, pkgName)
  const items: UserSidebarVip[] = []
  const files = await fg('**/*.md', {
    cwd: pkgResolvePath,
    onlyFiles: true,
    ignore: ['**/node_modules'],
  })

  const linksMap = files.map((relativePath) => {
    return pathToLink(relativePath, pkgName)
  })

  // check dirName link conflict with fileName, eg: docs/pkg/xxx/index.md -> docs/pkg/xxx.md
  const linkNameSet = new Set<string>()
  for (const { linkPath } of linksMap) {
    if (linkNameSet.has(linkPath)) {
      consola.error(`
      note: check directory name conflict with file name,
      linkPath conflict: ${linkPath}
      `)
      return []
    }
    linkNameSet.add(linkPath)
  }
  linkNameSet.clear()

  // get all the valid links in the docsDir+pkgName
  const alreadyExistLinks = await docsPkgLinkFiles(pkgName)
  for (const relativePath of alreadyExistLinks) {
    const resolvePath = path.join(docsDir, relativePath)
    const originPath = fs.readlinkSync(resolvePath)
    try {
      fs.accessSync(originPath, fs.constants.F_OK) // F.OK to check if the file exists
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (e) {
      fs.unlinkSync(resolvePath)
      consola.warn(`fs.unlinkSync: ${resolvePath}, origin file is not exist.`)
    }
  }

  // real-time exist
  for (const info of linksMap) {
    const { dirLevelName, linkPath, targetPath, routeLink } = info
    // generate sidebar
    generateSidebar(items, info)

    // check if the link exists, if not, create the link
    if (!fs.existsSync(linkPath) && filePathHandler) {
      if (typeof filePathHandler !== 'function') {
        consola.warn('filePathHandler is not a function, dont do anything.')
        continue
      }
      await filePathHandler({
        linkPath,
        targetPath,
        dirLevelName,
        routeLink,
      })

      consola.success('create link:', linkPath)
    }
  }

  return items
}
/**
 * fill collection with sidebar item
 * @param collection sidebar collection
 * @param dirLevelName dir level name, eg: ['components', 'button']
 * @param linkPath target file to link path
 */
function generateSidebar(collection: UserSidebarVip[], info: LinkInfo) {
  const { dirLevelName, routeLink, targetPath } = info

  if (!dirLevelName.length)
    return

  if (dirLevelName.length === 1) {
    collection.push({
      text: dirLevelName[0],
      link: routeLink,
      _targetPath: targetPath,
    })
    return
  }

  let originLevel: UserSidebarVip[] = collection
  for (let i = 0; i < dirLevelName.length; i++) {
    const dirName = dirLevelName[i]
    let isExistItem = originLevel.find(item => item.text === dirName)

    if (i === dirLevelName.length - 1) {
      if (isExistItem) {
        isExistItem.link = routeLink
      }
      else {
        originLevel.push({
          text: dirName,
          link: routeLink,
          _targetPath: targetPath,
        })
      }
    }
    else {
      if (!isExistItem) {
        isExistItem = {
          text: dirName,
          items: [],
        }
        originLevel.push(isExistItem)
      }
      originLevel = (isExistItem.items || (isExistItem.items = []))
    }
  }
}

/**
 * .vitepress/pkg/{relativePath} replace index.md to .md
 * @param relativePath
 * @param pkgName
 * @returns
 */
function pathToLink(relativePath: string, pkgName: string): LinkInfo {
  if (relativePath === 'index.md') {
    // {pkgName}/index.md => /{pkgName}/index
    return {
      dirLevelName: [PACKAGE_INDEX_TEXT],
      linkPath: path.join(docsDir, pkgName, relativePath),
      targetPath: path.join(packagesDir, pkgName, relativePath),
      routeLink: `/${pkgName}/index`,
    }
  }

  let dirLevelName
  const isHas = /(?:components|hooks)\/[^/]+\.md$/.test(relativePath)
  if (isHas) {
    // {components | hooks}/file.md => {components | hooks}/file
    dirLevelName = relativePath.replace(/\/([^/]+)\.md$/, '/$1')
  }
  else {
    // {components | hooks}/dir/index.md => {components | hooks}/dir
    dirLevelName = relativePath.replace(/(.+)\/index\.md$/, '$1')
  }

  const linkPath = path.join(docsDir, pkgName, isHas ? relativePath : `${dirLevelName}.md`)
  const targetPath = path.join(packagesDir, pkgName, relativePath)

  return {
    dirLevelName: dirLevelName.split('/'),
    linkPath,
    targetPath,
    routeLink: `/${pkgName}/${`${dirLevelName}`}`,
  }
}

/**
 * docs/{pkgName} all links path
 * @param pkgName
 * @param result
 * @returns
 */
async function docsPkgLinkFiles(pkgName: string, result: string[] = []) {
  const docsPkgDir = path.resolve(docsDir, pkgName)
  if (!fs.existsSync(docsPkgDir)) {
    return result
  }
  const allPath = fs.readdirSync(docsPkgDir, { encoding: 'utf-8', recursive: true })

  for (const item of allPath) {
    const stat = await fs.lstat(path.join(docsPkgDir, item))
    if (stat.isSymbolicLink()) {
      result.push(path.join(pkgName, item))
    }
    else {
      // stat.isDirectory() or stat.isFile() dont need to do anything
      continue
    }
  }

  return result
}
