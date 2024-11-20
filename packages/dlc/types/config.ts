import type { WriteFileSyncRestParams } from './global'

export interface UserConfig {
  // 项目根目录解析路径,绝对路径
  rootResolvePath: string
  file: UserConfigFileOption
  git: UserConfigGitOption
}

export interface UserConfigGitOption {
  owner: string
  repo: string
  // gitlab token 解决了私有仓库的权限问题 下载量限制
  pafg_token: string
  defaultBranch: string
}

export interface UserConfigFileOption {
  // 移除文件时, 白名单
  removeWhitePath: string[]
  // 下载文件，写入的相对文件夹，默认 . 即root
  downloadRelativeDest: string
  // writeFileSync 第二个数据格式。通过文件解析工具进行 transform。
  parse: (path: string, data: any) => Promise<WriteFileSyncRestParams>
}
export type UserConfigFnObject = () => UserConfig
export type UserConfigExport =
  | UserConfig
  | UserConfigFnObject
