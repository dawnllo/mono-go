import log, { type FuncKeys } from '../utils/log'

type UseFunction = (content: _Global.Context) => void | Promise<void>
type GeneratorType = Generator<UseFunction, string, void> | null

/**
 * 先注册功能函数串联起来, 每次run从头迭代.
 */
export default class MiddleWare {
  private queues: UseFunction[] = []
  private iterator: GeneratorType = null
  context: _Global.Context | null

  construction() {
  }

  use(fn: UseFunction) {
    if (typeof fn !== 'function')
      throw new Error('param must be a function')

    this.queues.push(fn.bind(this))
    return this
  }

  async run(context: _Global.Context) {
    this.context = context
    this.iterator = this.generator()

    let result = this.iterator!.next()

    const handlerResult = async () => {
      if (result.done)
        return

      const res = result.value(this.context!)
      if (res && typeof res.then === 'function') {
        try {
          await res
          result = this.iterator!.next()
          await handlerResult()
        }
        catch (error) {
          result = this.iterator!.throw(error)
          await handlerResult()
        }
      }
      else {
        // 同步
        result = this.iterator!.next()
        handlerResult()
      }
    }

    await handlerResult()
  }

  cancel(str: string, color: FuncKeys = 'yellow') {
    if (this.iterator) {
      log[color](str)
      return this.iterator.return('cancel')
    }
    else {
      throw new Error('not execute run !')
    }
  }

  *generator(): GeneratorType {
    const queues = this.queues
    for (let i = 0; i < queues.length; i++) {
      const fn = queues[i]
      yield fn!
    }
    return 'done'
  }
}
