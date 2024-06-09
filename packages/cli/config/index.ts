import path from 'node:path'
import { findUp, pathExists } from 'find-up'
import { file, log } from '../utils'
import { defaultConfig, getConfigFileName, normalizeConfig } from './constant'

// 获取根目录
async function getRootPath(): Promise<string | undefined> {
  return await findUp(async (directory) => {
    const isPkg = await pathExists(path.join(directory, 'package.json'))
    const isDlc = await pathExists(path.join(directory, getConfigFileName()))
    return (isPkg && isDlc && directory) as string
  }, { type: 'directory' })
}

// 初始化配置 (包块各个模块,依赖全局配置的 init )
export async function initConfig() {
  const rootAP = await getRootPath()
  if (!rootAP)
    throw new Error(log._red('config file not found'))

  const configFile = path.join(rootAP, getConfigFileName())

  let mergeConfig: _Global.ConfigFile = {} as _Global.ConfigFile
  if (await pathExists(configFile)) {
    const userConfig = await import(configFile)
    mergeConfig = Object.assign(defaultConfig, userConfig.default)
  }
  else {
    mergeConfig = defaultConfig
  }

  normalizeConfig(mergeConfig, rootAP)

  file.init(mergeConfig) // file模块初始化

  return mergeConfig
}
