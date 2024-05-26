import { cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import chalk from 'chalk'
import ora from 'ora'
import log from '../../utils/log'
import http from '../../utils/http'

export default async function getListAction() {
  const spinner = ora('fetching...').start()

  const config = {
    owner: 'Dofw',
    repo: 'vs-theme',
    type: _Global.GitFetchType.contents,
  }

  const res = await http.git(config)
  const json = await res.json()

  function recurse(json) {

  }

  const tempDest = path.join(cwd(), 'temp.json')
  await fs.writeFileSync(tempDest, JSON.stringify(json))
  spinner.succeed(chalk.green('fetching success'))
}
