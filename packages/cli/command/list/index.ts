import prompts from 'prompts'
import chalk from 'chalk'
import ora from 'ora'
import http from '../../utils/http'
import log from '../../utils/log'
import { generateCatalog } from '../../utils'

export default async function getListAction() {
  const spinner = ora('fetching...').start()

  const config = {
    owner: 'Dofw',
    repo: 'vs-theme',
    type: _Global.GitFetchType.trees,
    branch: 'master',
    recursive: false,
  }

  const res = await http.git(config)
  const json = await res.json()
  spinner.succeed(chalk.green('fetching success'))
  const catalog = generateCatalog(json.tree)

  const promptsConfig = [{
    type: 'autocomplete',
    name: 'url',
    message: 'please input filter keyword, then press enter to select!',
    choices: catalog.map((item) => {
      return {
        title: item.fileName,
        value: item.url,
      }
    }),
    async suggest(input, choices) {
      return choices.filter((choice) => {
        return choice.title.toLowerCase().includes(input.toLowerCase())
      })
    },
    initial: 0,
    fallback: 'no template exists in this repository!',
  }, {
    type: (url) => {
      return url ? 'toggle' : null
    },
    name: 'confirm',
    initial: false,
    active: 'yes',
    inactive: 'no',
    message: 'can you confirm download!',
  }]

  // 交互
  const result = await prompts(promptsConfig)

  if (!result.confirm)
    return log.red('download cancelled!')
  // download
}
