const Ware = (function () {
  const QUEUES = Symbol('执行队列')

  return class Ware {
    [QUEUES] = []

    constructor(context) {
      this.context = context || {}
    }

    use(fn) {
      if (typeof fn !== 'function')throw 'please pass a function'
      this[QUEUES].push(fn)
    }

    run() {
      const iterator = this.generator()
      let result = iterator.next()
      handlerResult()

      function handlerResult() {
        if (result.done) {
          return 
        }
        const res = result.value.call(this, this.context)
        // Promise
        if (typeof res.then === 'function') {
          res.then(() => {
            result = iterator.next()
            handlerResult()
          }).catch((err) => {
            result = iterator.throw(err)
            handlerResult()
          })
        }else{
          result = iterator.next()
          handlerResult()
        }
      }
    }
  
    *generator() {
      const queue = this[QUEUES]
      for (let i = 0; i < queue.length; i++) {
        const fn = queue[i];
        yield fn
      }
    }
  }
})()

export default Ware
