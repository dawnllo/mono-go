import chalk from 'chalk'
import MiddleWare from '../../core/middleware'
import parse from './parse'

const app = new MiddleWare()

// app
  .use(parse)

async function addAction(template, project, options) {
  if (!template)
    throw new Error(chalk.red('Missing require argument: `tempalte`.'))

  const context: _Global.Context = {
    template,
    project: project || template,
    options,
    src: '',
    dest: '',
    config: Object.create(null), // 获取模板，读取require
    answers: Object.create(null),
    files: [],
  }

  await app.run(context)
}

export default addAction
