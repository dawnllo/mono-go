import { cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import { errorInit, errorWrapper } from './error'
import { file, http, log } from '@/utils'
import type { ParseFunc, UserConfig, WriteFileSyncRestParams } from '@/types'
import { loadConfigFromFile } from '@/esbuild'

// allow config file list
export const CNONFIG_FILE_LIST = ['dlc.config.js', 'dlc.config.ts']

// default file content Parse
const defualtParse: ParseFunc = async (path: string, data: any): Promise<WriteFileSyncRestParams> => {
  // @ts-expect-error todo?
  return [Buffer.from(data.content, 'base64'), 'utf-8']
}

export const defaultConfig: UserConfig = {
  root: '.',
  rootResolvePath: '', // 运行时,init 绝对路径
  file: {
    // 文件下载/操作相关
    removeWhitePath: [],
    downloadRelativePath: '.',
    parse: defualtParse, // 内容解析函数
  },
  git: {
    owner: 'Dofw',
    repo: 'vs-theme',
    pafg_token: '',
    defaultBranch: 'main',
  },
}

// 配置归一化 TODO: 深度配置字段校验.
export function normalizeConfig(mergeConfig: UserConfig, rootResolvePath: string) {
  const keys = Object.keys(defaultConfig)
  const configKeys = Object.keys(mergeConfig)

  configKeys.forEach((key) => {
    if (!keys.includes(key))
      throw new Error (log._red(`${key} is invalid key in config`))
  })

  // 与路径相关, 相对路径全部转位绝对路径
  mergeConfig.rootResolvePath = rootResolvePath
  mergeConfig.root = path.resolve(rootResolvePath, mergeConfig.root)
  mergeConfig.file.removeWhitePath = mergeConfig.file.removeWhitePath.map((item) => {
    if (typeof item !== 'string')
      throw new Error(log._red('removeWhitePath must be string array'))
    return path.resolve(rootResolvePath, item)
  })
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

// 初始化配置
export const initConfig = errorWrapper(async () => {
  const result = await getRootPath()

  if (!result)
    throw new Error(log._red('config file not found'))

  const { rootResolvePath, configFileName } = result
  const configFile = path.join(rootResolvePath, configFileName)

  let mergeConfig: UserConfig = {} as UserConfig
  if (fs.existsSync(configFile)) {
    const loadResult = await loadConfigFromFile(rootResolvePath)
    console.log(123, loadResult)
    mergeConfig = Object.assign(defaultConfig, loadResult?.config || {})
  }
  else {
    mergeConfig = defaultConfig
  }

  return mergeConfig

  // normalizeConfig(mergeConfig, rootResolvePath)

  // file.init(mergeConfig) // file模块初始化
  // http.init(mergeConfig) // http模块初始化
  // errorInit() // globalThis 上添加错误类

  // return mergeConfig
})
