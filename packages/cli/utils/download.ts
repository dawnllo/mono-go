import { Buffer } from 'node:buffer'
import path from 'node:path'
import { cwd } from 'node:process'
import ora from 'ora'
import { file, http, log } from '../utils'

export function generateCatalog(data, type: _Global.GitFetchType.trees | _Global.GitFetchType.contents): _Global.CatalogItem[] {
  if (!data)
    return []

  const urlKey = type === _Global.GitFetchType.contents ? 'git_url' : 'url'

  // 生成目录
  const catalog: _Global.CatalogItem[] = []

  for (const item of data) {
    const ele: _Global.CatalogItem = {
      path: item.path,
      url: item[urlKey],
      type: type === _Global.GitFetchType.contents ? item.type : item.type === 'tree' ? 'dir' : 'file',
      size: item.size,
      sha: item.sha,
    }
    catalog.push(ele)
  }

  return catalog
}

// 下载
// file-blob
async function fileBlob(catalogItem: _Global.CatalogItem, configFile: _Global.ConfigFile): Promise<string> {
  const { url, path: itemPath } = catalogItem
  const downloadRelativePath = path.join(configFile.downloadRelativePath, itemPath)

  const spinner = ora(log._green(downloadRelativePath)).start()
  const res = await http.gitUrl(url)
  const data = await res.json()
  spinner.stop()

  const filePath = path.resolve(cwd(), downloadRelativePath)
  const buf = Buffer.from(data.content, 'base64')
  let finishPath
  try {
    finishPath = await file.writeSyncFile(filePath, buf)
  }
  catch (error) {
    throw new Error('writeSyncFile error.')
  }

  spinner.succeed(log._green(`${downloadRelativePath}, success.`))
  return finishPath
}

let _level = 0 // 递归层级
async function trees(catalogItem: _Global.CatalogItem, configFile: _Global.ConfigFile): Promise<string[]> {
  _level++
  const { sha, path } = catalogItem
  // 循环下载
  const config = {
    ...configFile.git,
    type: _Global.GitFetchType.trees,
    sha,
  }
  const res = await http.git(config)
  const json = await res.json()
  const catalog = generateCatalog(json.tree, _Global.GitFetchType.trees)
  const finishPath: string[] = []
  try {
    for (const item of catalog) {
      item.path = `${path}/${item.path}` // tree 获取的不带 父目录.这里拼接上
      if (item.type === 'file') {
        const finish = await fileBlob(item, configFile)
        finishPath.push(finish)
      }

      else if (item.type === 'dir') {
        const finishs = await trees(item, configFile)
        finishPath.push(...finishs)
      }
    }
  }
  catch (error) {
    for (const filePath of finishPath)
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

  return finishPath
}

interface DownloadType {
  fileBlob: (catalogItem: _Global.CatalogItem, configFile: _Global.ConfigFile) => Promise<string>
  trees: (catalogItem: _Global.CatalogItem, configFile: _Global.ConfigFile) => Promise<string[]>
}

export const download: DownloadType = {
  fileBlob,
  trees,
}
