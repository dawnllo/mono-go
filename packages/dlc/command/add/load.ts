import { cwd } from 'node:process'
import type MiddleWare from './middleware'
import type { Context } from './index'
import type { ParseFunc } from '@/types'
import { download, file, http, oraWrapper } from '@/utils/index'
import { GitFetchEnum } from '@/utils/http'

export default async function load(this: MiddleWare, _ctx: Context) {
  // 1. 下载原文件内容
  const { answers: { confirm }, args: [path, branch], configFile } = _ctx

  const { parse } = configFile.file

  let newPath = path
  if (confirm.isRenamed)
    newPath = file.pathRename(path, confirm.name)

  const config = {
    type: GitFetchEnum.contents,
    sha: newPath,
    branch,
  }

  await oraWrapper(async () => {
    const json = await http.git(config)
    // 单个文件,直接下载
    if (json.type === 'file') {
      console.log('json', json)
      const downloadRelativeDest = path.join(configFile.file.downloadRelativeDest, newPath)
      const filePath = path.resolve(cwd(), downloadRelativeDest)

      // 解析
      // const parse: ParseFunc = async (path, data) => {
      //   return [data.content]
      // }
      // const restParams = await parse(filePath, json)

      await file.writeFileSync(filePath, [json.content])
    }

    else {
      // 是array
      const arrs = download.oneLayerCatalog(json, GitFetchEnum.contents)
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
