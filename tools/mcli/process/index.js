// 流程
import parsePath from './parsePath.js'
import load from './load.js'
import MiddleWare from './cliMiddle.js'

// 作用域对config做约束。确实需要ts
export const ctx = {
  a: 1,
}

const app = new MiddleWare(ctx)

app.use(parsePath)
   .use(load)

const excuteQueues = (...args) => {
  // 融合参数
  ctx.args = args
  app.run()
}

export default excuteQueues
