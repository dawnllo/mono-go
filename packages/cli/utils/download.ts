import path from 'node:path'
import { cwd } from 'node:process'
import ora from 'ora'
import { file, http, log } from '@/utils/index'
import { GitFetchType } from '@/types'
import type { CatalogItem, ConfigFile, WriteFileSyncRestParams } from '@/types'

export type ParseFunc = (path: string, data: any) => Promise<WriteFileSyncRestParams>

// 单层目录content/tree格式统一.
function oneLayerCatalog(data: any[], type: GitFetchType.trees | GitFetchType.contents): CatalogItem[] {
  if (!data)
    return []

  const urlKey = type === GitFetchType.contents ? 'git_url' : 'url'

  // 生成目录
  const catalog: CatalogItem[] = []

  for (const item of data) {
    const ele: CatalogItem = {
      path: item.path,
      url: item[urlKey],
      type: type === GitFetchType.contents ? item.type : item.type === 'tree' ? 'dir' : 'file',
      size: item.size,
      sha: item.sha,
    }

    catalog.push(ele)
  }

  return catalog
}

// 递归目录
let treeLevel = 0 // 内部重置
async function treeLayerCatalog(data, type: GitFetchType.trees | GitFetchType.contents, level: number): Promise<CatalogItem[]> {
  const oneLayer = oneLayerCatalog(data, type)
  treeLevel++
  try {
    for (let i = 0; i < oneLayer.length; i++) {
      const element = oneLayer[i]!

      // level 不存在就不限制
      if (element.type === 'dir' && (!level || treeLevel < level)) {
        const json = await http.gitUrl(element.url)
        oneLayer[i]!.children = await treeLayerCatalog(json.tree, GitFetchType.trees, level)
        // 将路径进行拼接
        oneLayer[i]!.children = oneLayer[i]!.children?.map((item) => {
          return {
            ...item,
            relativeInputPath: path.join(element.path, item.path),
          }
        })
      }
    }
  }
  finally {
    treeLevel--
  }

  return oneLayer
}

// 下载
// file-blob

async function fileBlob(catalogItem: CatalogItem, configFile: ConfigFile, parse: ParseFunc): Promise<string> {
  const { url, path: itemPath } = catalogItem
  const downloadRelativePath = path.join(configFile.file.downloadRelativePath, itemPath)

  const spinner = ora(log._green(downloadRelativePath)).start()
  const data = await http.gitUrl(url)

  spinner.stop()

  // 绝对路径
  const filePath = path.resolve(cwd(), downloadRelativePath)
  const restParams = await parse(filePath, data)

  let finishPath
  try {
    finishPath = await file.writeFileSync(filePath, restParams)
  }
  catch (error) {
    throw new Error('writeFileSync error.')
  }

  spinner.succeed(log._green(`${downloadRelativePath}, success.`))
  return finishPath
}

let _level = 0 // 递归层级, 内部重置
/**
 * 递归调用fileBlob, 传递parse
 * @param catalogItem 单个目录信息
 * @param configFile 全局配置文件
 * @returns
 */
async function recursiveFileBlob(
  catalogItem: CatalogItem,
  configFile: ConfigFile,
  parse: ParseFunc,
): Promise<string[]> {
  _level++
  const finishPaths: string[] = []
  const { sha, path } = catalogItem

  try {
    const config = {
      type: GitFetchType.trees,
      sha,
    }
    const json = await http.git(config)
    const catalog = oneLayerCatalog(json.tree, GitFetchType.trees)
    for (const item of catalog) {
      item.path = `${path}/${item.path}` // tree 获取不包含父目录, 在这里拼接上父目录
      if (item.type === 'file') {
        const finish = await fileBlob(item, configFile, parse)
        finishPaths.push(finish)
      }

      else if (item.type === 'dir') {
        const finishs = await recursiveFileBlob(item, configFile, parse)
        finishPaths.push(...finishs)
      }
    }
  }
  catch (error) {
    for (const filePath of finishPaths)
      await file.rmSyncFile(`${filePath}`) // 删除whitepath

    // 同时删除当前文件夹下的空文件夹.
    await file.rmSyncEmptyDir(path)

    log.white('-- quit --')

    // 起始层, 不需要报错;
    if (_level > 1)
      throw new Error('download trees error.')
  }
  finally {
    _level-- // 执行完一层减1, 回归init
  }

  return finishPaths
}
interface DownloadType {
  fileBlob: (...args: Parameters<typeof fileBlob>) => ReturnType<typeof fileBlob>
  recursiveFileBlob: (...args: Parameters<typeof recursiveFileBlob>) => ReturnType<typeof recursiveFileBlob>
  oneLayerCatalog: (...args: Parameters<typeof oneLayerCatalog>) => ReturnType<typeof oneLayerCatalog>
  treeLayerCatalog: (...args: Parameters<typeof treeLayerCatalog>) => ReturnType<typeof treeLayerCatalog>
}

export const download: DownloadType = {
  fileBlob,
  recursiveFileBlob,
  oneLayerCatalog,
  treeLayerCatalog,
}
