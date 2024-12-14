import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'

import fg from 'fast-glob'
import { consola } from 'consola'
import type { DefaultTheme } from 'vitepress'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const docsDir = path.resolve(__dirname)
const rootDir = path.resolve(__dirname, '..')
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

getPackageSide('element-v3')
export async function getPackageSide(pkgName: string): Promise<DefaultTheme.SidebarItem[]> {
  const pkgResolvePath = path.resolve(packagesDir, pkgName)
  const items: DefaultTheme.SidebarItem[] = []

  const files = await fg('**/*.md', {
    cwd: pkgResolvePath,
    onlyFiles: true,
    ignore: ['**/node_modules'],
  })

  for (const relativePath of files) {
    console.log(666, normalizePath(relativePath))
  }

  const linksMap = files.map((relativePath) => {
    return pathToLink(relativePath, pkgName)
  })

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
  for (const { dirLevelName, linkPath, targetPath, routeLink } of linksMap) {
    // generate sidebar
    generateSidebar(items, dirLevelName, routeLink)

    // check if the link exists, if not, create the link
    if (!fs.existsSync(linkPath)) {
      consola.success('create link:', linkPath)
      fs.mkdirSync(path.dirname(linkPath), { recursive: true })
      // fs.symlinkSync(targetPath, linkPath)
      fs.copyFileSync(targetPath, linkPath)
    }
  }

  console.log(JSON.stringify(items, null, 2))
  return items
}
/**
 * fill collection with sidebar item
 * @param collection sidebar collection
 * @param dirLevelName dir level name, eg: ['components', 'button']
 * @param linkPath target file to link path
 */
function generateSidebar(collection: DefaultTheme.SidebarItem[], dirLevelName: string[], linkPath: string) {
  if (!dirLevelName.length)
    return

  if (dirLevelName.length === 1) {
    collection.push({
      text: dirLevelName[0],
      link: linkPath,
    })
    return
  }

  let originLevel: DefaultTheme.SidebarItem[] = collection
  for (let i = 0; i < dirLevelName.length; i++) {
    const dirName = dirLevelName[i]
    let isExistItem = originLevel.find(item => item.text === dirName)

    if (i === dirLevelName.length - 1) {
      if (isExistItem) {
        isExistItem.link = linkPath
      }
      else {
        originLevel.push({
          text: dirName,
          link: linkPath,
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
function pathToLink(relativePath: string, pkgName: string) {
  if (relativePath === 'index.md') {
    return {
      dirLevelName: [],
      linkPath: path.join(docsDir, pkgName, relativePath),
      targetPath: path.join(packagesDir, pkgName, relativePath),
      routeLink: `/${pkgName}/`,
    }
  }

  let dirLevelName
  const isHas = /(?:components|hooks)\/index\.md$/.test(relativePath)
  if (isHas) {
    dirLevelName = relativePath.replace(/\/index\.md$/, '')
  }
  else {
    dirLevelName = relativePath.replace(/(.+)\/index\.md$/, '$1')
  }

  const linkPath = path.join(docsDir, pkgName, isHas ? relativePath : `${dirLevelName}.md`)
  const targetPath = path.join(packagesDir, pkgName, relativePath)

  return {
    dirLevelName: isHas ? [] : dirLevelName.split('/'),
    linkPath,
    targetPath,
    routeLink: `/${pkgName}/${isHas ? `${dirLevelName}/` : `${dirLevelName}`}`,
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
