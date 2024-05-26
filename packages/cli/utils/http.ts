import chalk from 'chalk'
import log from '../utils/log'

// 策略
const urlStrategy = {
  [_Global.GitFetchType.contents]: (config: _Global.Config) => {
    return `https://api.github.com/repos/${config.owner}/${config.repo}/contents`
  },
  [_Global.GitFetchType.branches]: (config: _Global.Config) => {
    return `https://api.github.com/repos/${config.owner}/${config.repo}/branches/master`
  },
}

export async function git(config: _Global.Config) {
  let url
  const generate = urlStrategy[config.type]
  if (generate)
    url = generate(config)

  if (!url)
    throw new Error(chalk.red('urlStrategy not found, please check config.type!'))

  const options = new Request(url, {
    headers: {
      'User-Agent': '@dawnll/cli',
      'Accept': 'application/vnd.github.v3+json',
    },
  })
  return await fetch(options)
}

const http = {
  git,
}

export default http
