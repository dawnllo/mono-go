import { Buffer } from 'node:buffer'
import type { ParseFunc } from '@/utils/index'
import type { ConfigFile, WriteFileSyncRestParams } from '@/types'

// allow config file list
export const CNONFIG_FILE_LIST = ['dlc.config.js', 'dlc.config.ts']

// xxx
const defualtParse: ParseFunc = async (path: string, data: any): Promise<WriteFileSyncRestParams> => {
  return [Buffer.from(data.content, 'base64'), 'utf-8']
}

// default config
export const defaultConfig: ConfigFile = {
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
