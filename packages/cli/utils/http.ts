import { defaultConfig } from '../config/constant'
import { log } from '.'

const gitConfig: _Global.ConfigFile_Git = defaultConfig.git

/**
 * 初始化文件操作系统 - 需要的配置内容
 * @param configFile 全局配置文件
 */
function init(configFile: _Global.ConfigFile) {
  const dclGitConfig = configFile.git

  Object.keys(gitConfig).forEach((key) => {
    gitConfig[key] = dclGitConfig[key]
  })
}

// 策略
const urlStrategy = {
  [_Global.GitFetchType.contents]: (option: _Global.GitHttpOption) => {
    // .../contents/{path}{?ref} ref: branch, tag, commit
    const path = option.sha ? `${option.sha}` : ''
    const branch = option.branch || 'master'
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/contents/${path}?ref=${branch}`
  },
  [_Global.GitFetchType.branches]: () => {
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/branches`
  },
  [_Global.GitFetchType.trees]: (option: _Global.GitHttpOption) => {
    // .../git/trees/{sha}{?recursive=1}, sha: commit or ref(branch, tag)
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/git/trees/${option.sha}${option.recursive ? '?recursive=1' : ''}`
  },
  [_Global.GitFetchType.blobs]: (option: _Global.GitHttpOption) => {
    // .../git/blobs/{sha} sha: commit;
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/git/blobs/${option.sha}`
  },
}

async function git(option: _Global.GitHttpOption) {
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
    throw new Error(log._red(json.message))

  return json
}

export const http = {
  init,
  git,
  gitUrl,
}
