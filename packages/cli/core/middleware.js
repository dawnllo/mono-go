import log from './log.js'

const MiddleWare = (function () {
  const QUEUES = Symbol('执行队列')
  const ITERATOR = Symbol('迭代器')

  return class MiddleWare {
    // private
    [QUEUES] = [];
    [ITERATOR] = null

    construction() {
      this.context = null
    }

    use(fn) {
      if (typeof fn !== 'function')
        throw 'please pass a function'
      // 考虑是否bind
      this[QUEUES].push(fn)
      return this
    }

    async run(context) {
      // init context
      this.context = context
      const _that = this
      const iterator = (this[ITERATOR] = this.generator())

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
      if (this[ITERATOR]) {
        const _color = color || 'yellow'
        const _str = str || ''
        log[_color](_str)

        this[QUEUES].length = 0
        return this[ITERATOR].return('cancle')
      }
      else {
        throw 'not execute run !'
      }
    }

    *generator() {
      const queues = this[QUEUES]
      for (let i = 0; i < queues.length; i++) {
        const fn = queues[i]
        yield fn
      }
    }
  }
})()

export default MiddleWare
