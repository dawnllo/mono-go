import { cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { file, http, log } from '../utils'
import { defaultConfig, getConfigFileName, normalizeConfig } from './constant'

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

// 初始化配置 (包块各个模块,依赖全局配置的 init )
export async function initConfig() {
  const rootAP = await getRootPath()

  if (!rootAP)
    throw new Error(log._red('config file not found'))

  const configFile = path.join(rootAP, getConfigFileName())

  let mergeConfig: _Global.ConfigFile = {} as _Global.ConfigFile
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

  return mergeConfig
}
