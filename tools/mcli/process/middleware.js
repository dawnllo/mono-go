const MiddleWare = (function (){
  const QUEUES = Symbol('执行队列')
  
  return class MiddleWare {
    [QUEUES] = [] 
    
    construction () {
      this.context = null
    }

    use(fn) {
      if(typeof fn !== "function") throw "please pass a function"
      // 考虑是否bind
      this[QUEUES].push(fn)
      return this
    }

    async run(context) {
      // init context
      this.context = context

      const _that = this
      const iterator = this.generator()
      let result = iterator.next()
      handlerResult()

      //tools
      function handlerResult() {
        if (result.done) {
          return 
        }

        const res = result.value.call(_that, _that.context)

        // Promise
        if(res && typeof res.then === "function"){
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
      const queues = this[QUEUES]
      for (let i = 0; i < queues.length; i++) {
        const fn = queues[i];
        yield fn
      }
    }
  }
})()

export default MiddleWare