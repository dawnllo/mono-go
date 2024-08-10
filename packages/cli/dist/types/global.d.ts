import fs from 'node:fs';

declare enum ENUM_ERROR_TYPE {
    HTTP = "git_http_error",
    SYNTAX = "syntax_error"
}
declare class DLCHttpError extends Error {
    type: ENUM_ERROR_TYPE;
    constructor(type: ENUM_ERROR_TYPE, message: string);
}

declare global {
  /**
   * @description: 全局DLCHttp错误类
   */
  const DLCHttpError: typeof DLCHttpError

  export namespace _Global {
    interface ConfigFile {
      root: string
      rootAP: string
      file: ConfigFile_File
      git: ConfigFile_Git
    }

    interface ConfigFile_Git {
      owner: string
      repo: string
      pafg_token: string
      defaultBranch: string
    }

    interface ConfigFile_File {
      removeWhitePath: string[] // 移除文件时, 白名单
      downloadRelativePath: string
      parse: (path: string, data: any) => Promise<WriteFileSyncRestParams>
    }

    const enum GitFetchType {
      branches = 'branches',
      contents = 'contents',
      trees = 'trees',
      blobs = 'blobs',
    }

    // sha 的含义见http模块
    interface GitHttpOption {
      type: keyof typeof GitFetchType
      sha?: string
      branch?: string
      recursive?: boolean
    }
    // api.github.com, tree API
    interface CatalogItem {
      path: string
      url: string
      type: 'file' | 'dir'
      size: number
      sha: string
      relativeInputPath?: string // 相对于终端出入的起始路径, 递归将子目录的路径拼接起来;
      children?: CatalogItem[]
    }
  }

  type ExcludeFirstParams<T extends any[]> = T extends [any, ...rest: infer R] ? R : never
  type WriteFileSyncRestParams = ExcludeFirstParams<Parameters<typeof fs.writeFileSync>>
}
