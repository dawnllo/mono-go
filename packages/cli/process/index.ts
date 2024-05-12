// 流程
import chalk from 'chalk'
import MiddleWare from '../core/middleware'
// import parse from './parse'
// import load from './load'
// import confirm from './confirm'

const app = new MiddleWare()

// app
// .use(confirm) // 确定文件是否存在、确认。
// .use(parse) // 解析template为本地、远程。
// .use(load)

/**
 *
 * @param {*} template add <template> 模板名
 * @param {*} project [rename] 项目重命名
 * @param {*} options option 对象
 * @param {*} Command Command 对象
 */
async function excuteQueues(template, project, options) {
  if (template === null || template === '')
    throw new Error(chalk.red('Missing require argument: `tempalte`.'))

  // create context
  const context = {
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

export default excuteQueues
