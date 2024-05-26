declare module 'chalk'

declare namespace _Global {
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
  }

  interface Config {
    owner: string
    repo: string
    type: GitFetchType
  }

}
