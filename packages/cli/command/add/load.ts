import path from 'node:path'
import { cwd } from 'node:process'
import download from 'download-git-repo'
import ora from 'ora'
import chalk from 'chalk'
import { log } from '../../utils'
import type MiddleWare from './middleware'

export default async function load(this: MiddleWare, _ctx: _Global.Context) {
  // 1. 解析且替换模版内容

  // 2. 下载模版
}
