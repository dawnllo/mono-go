declare namespace _Global {

  interface ConfigFile {
    root: string
    rootAP: string
    removeWhitePath: string[] // 移除文件时, 白名单
  }

  interface Context {
    template: string
    project: string
    options: Record<string, string>
    src: string
    dest: string
    config: any // 获取模板，读取require
    answers: any
    files: string[]
  }

  const enum GitFetchType {
    branches = 'branches',
    contents = 'contents',
    trees = 'trees',
    blobs = 'blobs',
  }

  interface Config {
    owner: string
    repo: string
    type: GitFetchType
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
  }

}
