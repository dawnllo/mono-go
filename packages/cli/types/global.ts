import type fs from 'node:fs'
import type { GitFetchEnum } from '@/utils/http'

// sha 的含义见http模块
export interface GitHttpOption {
  type: keyof typeof GitFetchEnum
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
