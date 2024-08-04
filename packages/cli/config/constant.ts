import path from 'node:path'
import { Buffer } from 'node:buffer'
import type { ParseFunc, WriteFileSyncRestParams } from '../utils'
import { log } from '../utils'

const CNONFIG_FILE_DEFAULT = 'dlc.config.js'
const defualtParse: ParseFunc = async (path: string, data: any): Promise<WriteFileSyncRestParams> => {
  return [Buffer.from(data.content, 'base64')]
}

// 全局默认配置
export const defaultConfig: _Global.ConfigFile = {
  root: '.',
  rootAP: '', // 运行时,init 绝对路径
  file: {
    // 文件下载/操作相关
    removeWhitePath: [],
    downloadRelativePath: '.',
    parse: defualtParse,
  },
  git: {
    owner: 'Dofw',
    repo: 'vs-theme',
    pafg_token: '',
    defaultBranch: 'main',
  },
}

// 获取配置文件名
export function getConfigFileName() {
  return CNONFIG_FILE_DEFAULT
}

// 配置归一化 TODO: 深度配置字段校验.
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
  mergeConfig.file.removeWhitePath = mergeConfig.file.removeWhitePath.map((item) => {
    if (typeof item !== 'string')
      throw new Error(log._red('removeWhitePath must be string array'))
    return path.resolve(rootAP, item)
  })
}
