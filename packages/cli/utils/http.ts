import { defaultConfig } from '@/config/constant'
import { ENUM_ERROR_TYPE } from '@/config/error'
import { log } from '.'
import type { ConfigFile, GitHttpOption, ConfigFile_Git } from '@/types'

const gitConfig: ConfigFile_Git = defaultConfig.git

/**
 * 初始化文件操作系统 - 需要的配置内容
 * @param configFile 全局配置文件
 */
function init(configFile: ConfigFile) {
  const dclGitConfig = configFile.git

  Object.keys(gitConfig).forEach((key) => {
    gitConfig[key] = dclGitConfig[key]
  })
}

// 策略
const urlStrategy = {
  [GitFetchType.contents]: (option: GitHttpOption) => {
    // .../contents/{path}{?ref} ref: branch, tag, commit
    const path = option.sha ? `${option.sha}` : ''
    const branch = option.branch || gitConfig.defaultBranch
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/contents/${path}?ref=${branch}`
  },
  [GitFetchType.branches]: () => {
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/branches`
  },
  [GitFetchType.trees]: (option: GitHttpOption) => {
    // .../git/trees/{sha}{?recursive=1}, sha: commit or ref(branch, tag)
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/git/trees/${option.sha}${option.recursive ? '?recursive=1' : ''}`
  },
  [GitFetchType.blobs]: (option: GitHttpOption) => {
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
    throw new DLCHttpError(ENUM_ERROR_TYPE.HTTP, json.message)

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
