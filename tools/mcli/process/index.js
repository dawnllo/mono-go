// 流程
import MiddleWare from '../core/middleware.js'
import parse from './parse.js'
import load from './load.js'

const app = new MiddleWare()

app.use(parse)
   .use(load)

const excuteQueues = async (template, project, options) => {
  
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
