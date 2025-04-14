import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import type { DefaultTheme } from 'vitepress'

export interface CreateSideOption {
  indexText?: string
  hasSuffix?: boolean
}
export interface LinkInfo {
  dirLevelName: string[] // dir level, eg: elements-v3/components/button/index.md, ['components', 'button']
  routeLink: string
}
export type UserSidebarVip = DefaultTheme.SidebarItem 

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const defaultCreateSideOption: CreateSideOption = {
  indexText: 'overview',
  hasSuffix: true,
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
export async function createPackageLinksSide(pkgName: string, option?: CreateSideOption): Promise<UserSidebarVip[]> {
  option = {
    ...defaultCreateSideOption,
    ...option,
  }
  const pkgResolvePath = path.resolve(rootDir, pkgName)
  const items: UserSidebarVip[] = []
  const files = await fg('**/*.md', {
    cwd: pkgResolvePath,
    onlyFiles: true,
    ignore: ['**/node_modules'],
  })

  const linksMap = files.map((relativePath) => {
    return pathToLink(relativePath, pkgName, option)
  })
  for (const info of linksMap) {
    generateSidebar(items, info, option)
  }
  return items
}
/**
 * fill collection with sidebar item
 * @param collection sidebar collection
 * @param dirLevelName dir level name, eg: ['components', 'button']
 * @param linkPath target file to link path
 */
function generateSidebar(collection: UserSidebarVip[], info: LinkInfo, option: CreateSideOption) {
  const { dirLevelName, routeLink } = info

  if (!dirLevelName.length)
    return

  if (dirLevelName.length === 1) {
    collection.push({
      text: dirLevelName[0],
      link: routeLink,
    })
    return
  }

  let levelCollection: UserSidebarVip[] = collection
  for (let i = 0; i < dirLevelName.length; i++) {
    const dirName = dirLevelName[i]
    let isExistItem = levelCollection.find(item => item.text === dirName)

    if (i === dirLevelName.length - 1) {
      if (isExistItem) {
        isExistItem.link = routeLink
      }else {
        levelCollection.push({
          text: dirName,
          link: routeLink,
        })  
      }
    }
    else {
      if (!isExistItem) {
        isExistItem = {
          text: dirName,
          items: [],
        }
        levelCollection.push(isExistItem)
      }
      levelCollection = (isExistItem.items || (isExistItem.items = []))
    }
  }
}

/**
 * pkg/indes => [indexText]
 * pkg/components/index => [components, index] => [components]
 * pkg/components/button/index => [components, button, index] => [components, button]
 * pkg/components/button => [components, button]
 * @param relativePath
 * @param pkgName
 * @returns
 */
function pathToLink(relativePath: string, pkgName: string, option: CreateSideOption): LinkInfo {
  relativePath = option.hasSuffix 
    ? relativePath
      : relativePath.replace(/([^/]+)\.(.*)$/, '$1')
  const dirLevelNameArr = relativePath.split('/')
  if (dirLevelNameArr.length === 1 && dirLevelNameArr[0].includes('index')) {
    return {
      dirLevelName: [option.indexText!],
      routeLink: `/${pkgName}/${relativePath}`,
    }
  }

  // len 大于 1
  if(dirLevelNameArr[dirLevelNameArr.length - 1].includes('index')) {
    dirLevelNameArr.pop()
  }
  return {
    dirLevelName: dirLevelNameArr,
    routeLink: `/${pkgName}/${relativePath}`,
  }
}
