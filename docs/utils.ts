import path, { relative } from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { consola } from 'consola'
import type { DefaultTheme } from 'vitepress'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const docsDir = path.resolve(__dirname)
const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.resolve(rootDir, 'packages')
const linkCache = new WeakMap<DefaultTheme.SidebarItem, string>()

export async function getPackageSide(pkgName: string) {
  const pkgResolvePath = path.resolve(packagesDir, pkgName)
  const files = await fg('**/index.md', {
    cwd: pkgResolvePath,
    markDirectories: true,
    ignore: ['**/node_modules'],
  })

  const linksMap = files.map((relativePath) => {
    return pathToLink(relativePath, pkgName)
  })

  const items: DefaultTheme.SidebarItem[] = []

  // TODO check if the linkCache,s file exists in linksMap, if not, delete the cache of link
  for (const [key, value] of linkCache) {
    if (!fs.existsSync(value)) {
      linkCache.delete(key)
    }
    // fs.unlinkSync(linkPath)
    // consola.warn(`fs.unlinkSync: ${linkPath}`)
  }

  // real-time exist
  for (const { compDirName, linkPath, targetPath } of linksMap) {
    items.push({
      text: compDirName,
      link: `/${pkgName}/${compDirName}`,
    })

    // check if the link exists, if not, create the link
    if (!fs.existsSync(linkPath)) {
      fs.mkdirSync(path.dirname(linkPath), { recursive: true })
      fs.symlinkSync(targetPath, linkPath)

      linkCache.set(items[items.length - 1], linkPath)
    }
  }
  console.log(items)
  return items
}

/**
 * .vitepress/pkg/{relativePath} replace index.md to .md
 * @param relativePath
 * @param pkgName
 * @returns
 */
function pathToLink(relativePath: string, pkgName: string) {
  const compDirName = relativePath.replace(/(.+)\/index\.md$/, '$1')
  const linkPath = path.join(docsDir, pkgName, `${compDirName}.md`)
  const targetPath = path.join(packagesDir, pkgName, relativePath)

  return {
    compDirName,
    linkPath,
    targetPath,
  }
}

console.log(getPackageSide('element-v3'))
