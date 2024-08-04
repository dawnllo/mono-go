import { cwd } from 'node:process'
import path from 'node:path'
import { download, file, http, log, oraWrapper, pro } from '../../utils'
import type MiddleWare from './middleware'
import type { Context } from './index'

export default async function load(this: MiddleWare, _ctx: Context) {
  // 1. 下载原文件内容
  const { answers: { confirm }, args: [path, branch] } = _ctx

  let newPath = path
  if (confirm.isRenamed)
    newPath = file.pathRename(path, confirm.name)

  const gitConfig = {
    type: _Global.GitFetchType.contents,
    sha: newPath,
    branch,
  }
  console.log(gitConfig)
  // async function dowanloadFunc(fileOption, configFile) {
  //   const { type } = fileOption
  //   if (type === 'file') {
  //     await download.fileBlob(fileOption, configFile)
  //     return
  //   }
  //   if (type === 'dir')
  //     await download.recursiveFileBlob(fileOption, configFile)
  // }
}
