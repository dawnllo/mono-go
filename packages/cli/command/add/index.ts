import chalk from 'chalk'
import MiddleWare from '../../utils/middleware'
import load from './load'
import confirm from './confirm'

const app = new MiddleWare()

// 先确认, 在加载
app
  .use(confirm)
  .use(load)

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
