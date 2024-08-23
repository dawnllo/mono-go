import type { WriteFileSyncRestParams } from './global'

export interface UserConfig {
  root: string
  rootResolvePath: string
  file: UserConfigFileOption
  git: UserConfigGitOption
}

export interface UserConfigGitOption {
  owner: string
  repo: string
  pafg_token: string
  defaultBranch: string
}

export interface UserConfigFileOption {
  removeWhitePath: string[] // 移除文件时, 白名单
  downloadRelativePath: string
  parse: (path: string, data: any) => Promise<WriteFileSyncRestParams>
}
export type UserConfigFnObject = () => UserConfig
export type UserConfigExport =
  | UserConfig
  | UserConfigFnObject
