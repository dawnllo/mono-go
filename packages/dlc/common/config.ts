import { cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import { type ConfigEnv, loadConfigFromFile } from 'vite'
import { errorInit, errorWrapper } from './error'
import { file, http, log } from '@/utils'
import type { ParseFunc, UserConfig, WriteFileSyncRestParams } from '@/types'

// allow config file list
export const CNONFIG_FILE_LIST = ['dlc.config.ts', 'dlc.config.js']

// default file content Parse
const defualtParse: ParseFunc = async (path: string, data: any): Promise<WriteFileSyncRestParams> => {
  const content = Buffer.from(data.content, 'base64') as Uint8Array
  return [content, 'utf-8']
}

export const defaultConfig: UserConfig = {
  rootResolvePath: '', // 运行时,init 绝对路径
  file: {
    removeWhitePath: [], // 删除白名单
    downloadRelativeDest: '.', // 目标文件夹
    parse: defualtParse, // 内容解析函数
  },
  // git 为必填项，这里处理用户字段合理性需要。
  git: {
    owner: 'Dofw',
    repo: 'vs-theme',
    pafg_token: '',
    defaultBranch: 'main',
  },
}

// 获取根目录
interface RootPathConfigName {
  rootResolvePath: string
  configFileName: string
}
async function getRootPath(): Promise<RootPathConfigName | undefined> {
  const packageName = 'package.json'

  let curCwdPath = cwd()

  for (const element of CNONFIG_FILE_LIST) {
    while (curCwdPath) {
      const configFile = path.join(curCwdPath, element)
      const packFile = path.join(curCwdPath, packageName)

      if (fs.existsSync(configFile) && fs.existsSync(packFile))
        return { rootResolvePath: curCwdPath, configFileName: element }

      // 到达根目录
      if (curCwdPath === path.dirname(curCwdPath))
        return undefined

      curCwdPath = path.dirname(curCwdPath)
    }
  }
}

// 配置归一化 TODO: 深度配置字段校验.
export function normalizeConfigPath(mergeConfig: UserConfig, rootResolvePath: string) {
  // 根的绝对路径
  mergeConfig.rootResolvePath = rootResolvePath

  if (!mergeConfig.file.removeWhitePath && !Array.isArray(mergeConfig.file.removeWhitePath))
    throw new Error(log._red('removeWhitePath must be string array'))

  mergeConfig.file.removeWhitePath = mergeConfig.file.removeWhitePath.map((item) => {
    if (typeof item !== 'string')
      throw new Error(log._red('removeWhitePath must be string array'))
    return path.resolve(rootResolvePath, item)
  })
}

function checkGitConfig(config: RequirePick<UserConfig, 'git'>) {
  if (!config.git)
    throw new Error(log._red('git config is not complete'))

  const keys = Object.keys(defaultConfig.git)
  keys.forEach((key) => {
    if (!config.git[key])
      throw new Error(log._red(`${key} is require key in config.git`))
  })
}

type RequirePick<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>
function mergeConfig(defaultConfig: UserConfig, inputConfig: RequirePick<UserConfig, 'git'> | undefined) {
  inputConfig = inputConfig || {} as UserConfig

  const keys = Object.keys(defaultConfig)
  const configKeys = Object.keys(inputConfig)
  configKeys.forEach((key) => {
    if (!keys.includes(key))
      throw new Error (log._red(`${key} is invalid key in config`))

    // 递归处理内部对象
    if (typeof inputConfig[key] === 'object') {
      inputConfig[key] = mergeConfig(defaultConfig[key], inputConfig[key])
    }
  })

  const result = Object.assign(defaultConfig, inputConfig)
  return result
}

// 初始化配置
export const initConfig = errorWrapper(async () => {
  const result = await getRootPath()

  if (!result)
    throw new Error(log._red('current cwd not found config file dlc.config.ts or dlc.config.js!!'))

  const { rootResolvePath, configFileName } = result
  const configFileResolvePath = path.join(rootResolvePath, configFileName)

  if (!fs.existsSync(configFileResolvePath))
    throw new Error(log._red('config file not found!!'))

  let config: UserConfig = {} as UserConfig
  const loadParams = {
    configEnv: {} as ConfigEnv,
    configFile: configFileResolvePath,
    configRoot: rootResolvePath || cwd(),
  }
  const loadResult = await loadConfigFromFile(
    loadParams.configEnv,
    loadParams.configFile,
    loadParams.configRoot,
  )
  // git 配置项必须传入
  const inputConfig = loadResult?.config as RequirePick<UserConfig, 'git'>
  checkGitConfig(inputConfig)

  config = mergeConfig(defaultConfig, inputConfig)

  normalizeConfigPath(config, rootResolvePath)

  file.init(config) // file模块初始化
  http.init(config) // http模块初始化
  errorInit() // globalThis 上添加错误类

  return config
})
