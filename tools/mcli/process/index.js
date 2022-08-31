// 流程
import parsePath from './parsePath.js'
import load from './load.js'
import MiddleWare from './middleware.js'

const app = new MiddleWare()

app.use(parsePath)
   .use(load)

const excuteQueues = async (path, project, options) => {
  
  if(path === null || path === '') throw new Error('Missing require argument: `tempalte`.')
  
  // create context
  const context = {
    path,
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
