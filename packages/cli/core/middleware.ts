import log from '../utils/log.js'

export default class MiddleWare {
  #queues = []
  #iterator = null

  construction() {
    this.context = null
  }

  use(fn) {
    if (typeof fn !== 'function')
      throw 'please pass a function'
    // 考虑是否bind
    this.#queues.push(fn)
    return this
  }

  async run(context) {
    // init context
    this.context = context
    const _that = this
    const iterator = (this.#iterator = this.generator())

    let result = iterator.next()
    await handlerResult()

    // tools
    async function handlerResult() {
      if (result.done)
        return
      // 运行func
      const res = result.value.call(null, _that.context, _that)

      // Promise
      if (res && typeof res.then === 'function') {
        try {
          await res
          result = iterator.next()
          await handlerResult()
        }
        catch (error) {
          result = iterator.throw(error)
          await handlerResult()
        }
      }
      else {
        // 同步
        result = iterator.next()
        handlerResult()
      }
    }
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
      throw 'not execute run !'
    }
  }

  *generator() {
    const queues = this.#queues
    for (let i = 0; i < queues.length; i++) {
      const fn = queues[i]
      yield fn
    }
  }
}
