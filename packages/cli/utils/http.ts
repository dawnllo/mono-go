import { log } from '.'

// 策略
const urlStrategy = {
  [_Global.GitFetchType.contents]: (option: _Global.GitHttpOption) => {
    // .../contents/{path}{?ref} ref: branch, tag, commit
    return `https://api.github.com/repos/${option.owner}/${option.repo}/contents/${option.sha}${option.branch ? `?ref=${option.branch}` : ''}`
  },
  [_Global.GitFetchType.branches]: (option: _Global.GitHttpOption) => {
    return `https://api.github.com/repos/${option.owner}/${option.repo}/branches`
  },
  [_Global.GitFetchType.trees]: (option: _Global.GitHttpOption) => {
    // .../git/trees/{sha}{?recursive=1}, sha: commit or ref(branch, tag)
    return `https://api.github.com/repos/${option.owner}/${option.repo}/git/trees/${option.sha}${option.recursive ? '?recursive=1' : ''}`
  },
  [_Global.GitFetchType.blobs]: (option: _Global.GitHttpOption) => {
    // .../git/blobs/{sha} sha: commit;
    return `https://api.github.com/repos/${option.owner}/${option.repo}/git/blobs/${option.sha}`
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
    },
  })

  return await fetch(options)
}

export const http = {
  git,
  gitUrl,
}
