import { cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { defaultConfig, getConfigFileName, normalizeConfig } from './constant'
import { errorInit, errorWrapper } from './error'
import { file, http, log } from '@/utils/index'

// 获取根目录
async function getRootPath(): Promise<string | undefined> {
  const packageName = 'package.json'
  const dlcName = getConfigFileName()

  let curCwdPath = cwd()

  while (curCwdPath) {
    const configFile = path.join(curCwdPath, dlcName)
    const packFile = path.join(curCwdPath, packageName)

    if (fs.existsSync(configFile) && fs.existsSync(packFile))
      return curCwdPath

    // 到达根目录
    if (curCwdPath === path.dirname(curCwdPath))
      return undefined

    curCwdPath = path.dirname(curCwdPath)
  }
}
// 初始化配置
export const initConfig = errorWrapper(async () => {
  const rootAP = await getRootPath()

  if (!rootAP)
    throw new Error(log._red('config file not found'))

  const configFile = path.join(rootAP, getConfigFileName())

  let mergeConfig: ConfigFile = {} as ConfigFile
  if (fs.existsSync(configFile)) {
    const userConfig = await import(configFile)
    mergeConfig = Object.assign(defaultConfig, userConfig.default)
  }
  else {
    mergeConfig = defaultConfig
  }

  normalizeConfig(mergeConfig, rootAP)

  file.init(mergeConfig) // file模块初始化
  http.init(mergeConfig) // http模块初始化
  errorInit() // globalThis 上添加错误类

  return mergeConfig
})
