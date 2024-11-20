import { log } from '.'
import { ERROR_TYPE_ENUM } from '@/common/error'
import type { GitHttpOption, UserConfig, UserConfigGitOption } from '@/types'

export enum GitFetchEnum {
  branches = 'branches',
  contents = 'contents',
  trees = 'trees',
  blobs = 'blobs',
}

const gitConfig: UserConfigGitOption = {} as UserConfigGitOption

/**
 * 初始化文件操作系统 - 需要的配置内容
 * @param configFile 全局配置文件
 */
function init(configFile: UserConfig) {
  const dclUserConfigGitOption = configFile.git

  Object.keys(gitConfig).forEach((key) => {
    gitConfig[key] = dclUserConfigGitOption[key]
  })
}

// 策略
const urlStrategy = {
  [GitFetchEnum.contents]: (option: GitHttpOption) => {
    // .../contents/{path}{?ref} ref: branch, tag, commit
    const path = option.sha ? `${option.sha}` : ''
    const branch = option.branch || gitConfig.defaultBranch
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/contents/${path}?ref=${branch}`
  },
  [GitFetchEnum.branches]: () => {
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/branches`
  },
  [GitFetchEnum.trees]: (option: GitHttpOption) => {
    // .../git/trees/{sha}{?recursive=1}, sha: commit or ref(branch, tag)
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/git/trees/${option.sha}${option.recursive ? '?recursive=1' : ''}`
  },
  [GitFetchEnum.blobs]: (option: GitHttpOption) => {
    // .../git/blobs/{sha} sha: commit;
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/git/blobs/${option.sha}`
  },
}

async function git(option: GitHttpOption) {
  let url
  const generate = urlStrategy[option.type]
  if (generate)
    url = generate(option)

  return await gitUrl(url)
}

async function gitUrl(url) {
  if (!url)
    throw new Error(log._red('urlStrategy not found, please check option.type!'))

  const options = new Request(url, {
    headers: {
      'User-Agent': '@dawnll/cli',
      'Accept': 'application/vnd.github.v3+json',
      'authorization': `Bearer ${gitConfig.pafg_token}`,
    },
  })

  const res = await fetch(options)
  const json = await res.json()

  if (json.message)
    throw new DLCHttpError(ERROR_TYPE_ENUM.HTTP, json.message)

  return json
}

interface HttpMethods {
  init: (...args: Parameters<typeof init>) => ReturnType<typeof init>
  git: (...args: Parameters<typeof git>) => ReturnType<typeof git>
  gitUrl: (...args: Parameters<typeof gitUrl>) => ReturnType<typeof gitUrl>
}

export const http: HttpMethods = {
  init,
  git,
  gitUrl,
}
