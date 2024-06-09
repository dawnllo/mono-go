import path from 'node:path'
import { log } from '../utils'

const CNONFIG_FILE_DEFAULT = 'dlc.config.js'

// 全局默认配置
export const defaultConfig: _Global.ConfigFile = {
  root: '.',
  rootAP: '', // 运行时,init
  removeWhitePath: [],
}

// 获取配置文件名
export function getConfigFileName() {
  return CNONFIG_FILE_DEFAULT
}

// 配置归一化
export function normalizeConfig(mergeConfig: _Global.ConfigFile, rootAP: string) {
  const keys = Object.keys(defaultConfig)
  const configKeys = Object.keys(mergeConfig)

  configKeys.forEach((key) => {
    if (!keys.includes(key))
      throw new Error (log._red(`${key} is invalid key in config`))
  })

  // 与路径相关, 相对路径全部转位绝对路径
  mergeConfig.rootAP = rootAP
  mergeConfig.root = path.resolve(rootAP, mergeConfig.root)
  mergeConfig.removeWhitePath = mergeConfig.removeWhitePath.map((item) => {
    if (typeof item !== 'string')
      throw new Error(log._red('removeWhitePath must be string array'))
    return path.resolve(rootAP, item)
  })
}
