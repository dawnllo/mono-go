// 流程
import parse from './parse'
import load from './load'

export const ctx = {
  a: 1,
}

function *generatorTemp() {
  yield parse(ctx)
  yield load(ctx)
  // yield inquire()
  // yield setupHook()
  // yield prepare()
  // yield render()
  // yield emit() //写入
  // yield install()
  // yield complete()
}

const temp = generatorTemp()

class CliMiddleWare {
  
}


