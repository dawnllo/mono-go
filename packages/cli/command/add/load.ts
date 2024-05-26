import path from 'node:path'
import { cwd } from 'node:process'
import download from 'download-git-repo'
import ora from 'ora'
import chalk from 'chalk'
import log from '../../utils/log'

export default async function load(_ctx: _Global.Context) {
  const dest = path.resolve(cwd(), 'templates')
  const spinner = ora({
    text: 'Downloading template...',
  }).start()

  download('github:Dofw/vs-theme', dest, (err) => {
    if (err)
      return log.red('download error ==', err)
    spinner.succeed(chalk.green('Get template success!'))
  })
}
