import type fs from 'node:fs'

export interface ConfigFile {
  root: string
  rootAP: string
  file: ConfigFile_File
  git: ConfigFile_Git
}

export interface ConfigFile_Git {
  owner: string
  repo: string
  pafg_token: string
  defaultBranch: string
}

export interface ConfigFile_File {
  removeWhitePath: string[] // 移除文件时, 白名单
  downloadRelativePath: string
  parse: (path: string, data: any) => Promise<WriteFileSyncRestParams>
}

export const enum GitFetchType {
  branches = 'branches',
  contents = 'contents',
  trees = 'trees',
  blobs = 'blobs',
} 

// sha 的含义见http模块
export interface GitHttpOption {
  type: keyof typeof GitFetchType
  sha?: string
  branch?: string
  recursive?: boolean
}
// api.github.com, tree API
export interface CatalogItem {
  path: string
  url: string
  type: 'file' | 'dir'
  size: number
  sha: string
  relativeInputPath?: string // 相对于终端出入的起始路径, 递归将子目录的路径拼接起来;
  children?: CatalogItem[]
}

export type ExcludeFirstParams<T extends any[]> = T extends [any, ...rest: infer R] ? R : never
export type WriteFileSyncRestParams = ExcludeFirstParams<Parameters<typeof fs.writeFileSync>>
