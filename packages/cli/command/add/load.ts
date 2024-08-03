import { cwd } from 'node:process'
import path from 'node:path'
import { download, http, log, oraWrapper, pro } from '../../utils'
import type MiddleWare from './middleware'

export default async function load(this: MiddleWare, _ctx: _Global.Context) {
  // 1. 下载原文件内容
  const { configFile: { file, git }, answers: { confirm } } = _ctx

  const rename = confirm.name // rename
  console.log('downloadRelativePath', file.downloadRelativePath)
  console.log('rename', rename)
  console.log('git', git)

  // const downloadPath = path.resolve(cwd(), file.downloadRelativePath)
  // const config = {
  //   ...git,
  //   type: _Global.GitFetchType.contents,
  //   sha: repPath,
  //   branch,
  // }

  // async function dowanloadFunc(fileOption, configFile) {
  //   const { type } = fileOption
  //   if (type === 'file') {
  //     await download.fileBlob(fileOption, configFile)
  //     return
  //   }
  //   if (type === 'dir')
  //     await download.trees(fileOption, configFile)
  // }

  // 2. 解析且替换模版内容

  // 3. 写入文件
}
