import log from '../utils/log'

type GeneratorType = Generator<(content: any, middleware: MiddleWare) => void | Promise<void>, string, void>

export default class MiddleWare {
  #queues: any[] = []
  #iterator: GeneratorType
  context: any

  construction() {
    this.#iterator = this.generator()
  }

  use(fn) {
    if (typeof fn !== 'function')
      throw new Error('use function must be a function')
    // 考虑是否bind
    this.#queues.push(fn)
    return this
  }

  async run(context) {
    // init context
    this.context = context

    let result = this.#iterator.next()

    // tools
    const handlerResult = async () => {
      if (result.done)
        return
      // 运行func
      const res = result.value.call(null, this.context, this)

      // Promise
      if (res && typeof res.then === 'function') {
        try {
          await res
          result = this.#iterator.next()
          await handlerResult()
        }
        catch (error) {
          result = this.#iterator.throw(error)
          await handlerResult()
        }
      }
      else {
        // 同步
        result = this.#iterator.next()
        handlerResult()
      }
    }

    await handlerResult()
  }

  cancle(str, color) {
    if (this.#iterator) {
      const _color = color || 'yellow'
      const _str = str || ''
      log[_color](_str)

      this.#queues.length = 0
      return this.#iterator.return('cancle')
    }
    else {
      throw new Error('not execute run !')
    }
  }

  *generator(): GeneratorType {
    const queues = this.#queues
    for (let i = 0; i < queues.length; i++) {
      const fn = queues[i]
      yield fn
    }
    return 'done'
  }
}
