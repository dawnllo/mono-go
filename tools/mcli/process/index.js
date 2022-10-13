// 流程
import MiddleWare from '../core/middleware.js'
import parse from './parse.js'
import load from './load.js'
// import confirm from './comfirm.js'

const app = new MiddleWare()

app.use(parse)
   .use(load)

/**
 * 
 * @param {*} template add <template> 模板名
 * @param {*} project [rename] 项目重命名
 * @param {*} options option 对象
 * @param {*} Command Command 对象
 */
const excuteQueues = async (template, project, options, Command) => {
  
  if(template === null || template === '') throw new Error('Missing require argument: `tempalte`.')
  
  // create context
  const context = {
    template,
    project,
    options,
    src: '',
    dest: '',
    config: Object.create(null), // 获取模板，读取require
    answers: Object.create(null),
    files: []
  }

  await app.run(context)
}

export default excuteQueues
