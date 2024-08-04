import { cwd } from 'node:process'
import path from 'node:path'
import { type ParseFunc, download, file, http, log, oraWrapper, pro } from '../../utils'
import type MiddleWare from './middleware'
import type { Context } from './index'

export default async function load(this: MiddleWare, _ctx: Context) {
  // 1. 下载原文件内容
  const { answers: { confirm }, args: [path, branch], configFile } = _ctx

  const { parse } = configFile.file

  let newPath = path
  if (confirm.isRenamed)
    newPath = file.pathRename(path, confirm.name)

  const config = {
    type: _Global.GitFetchType.contents,
    sha: newPath,
    branch,
  }

  await oraWrapper(async () => {
    const json = await http.git(config)
    // 单个文件,直接下载
    if (json.type === 'file') {
      console.log('json', json)
      const downloadRelativePath = path.join(configFile.file.downloadRelativePath, newPath)
      const filePath = path.resolve(cwd(), downloadRelativePath)

      // 解析
      // const parse: ParseFunc = async (path, data) => {
      //   return [data.content]
      // }
      // const restParams = await parse(filePath, json)

      await file.writeFileSync(filePath, [json.content])
    }

    else {
      // 是array
      const arrs = download.oneLayerCatalog(json, _Global.GitFetchType.contents)
      for (const fileOption of arrs)
        await dowanloadFunc(fileOption, configFile, parse) // TODO: 解析函数通过配置文件读取.
    }
  })
}

async function dowanloadFunc(fileOption, configFile, parse: ParseFunc) {
  const { type } = fileOption
  if (type === 'file') {
    await download.fileBlob(fileOption, configFile, parse)
    return
  }
  if (type === 'dir')
    await download.recursiveFileBlob(fileOption, configFile, parse)
}
