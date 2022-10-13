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
      async function handlerResult() {
        if (result.done) {
          return 
        }

        //运行func
        const res = result.value.call(_that, _that.context)

        // Promise
        if(res && typeof res.then === "function"){
          try {
            await res
            result = iterator.next()
            handlerResult()
          } catch (error) {
            result = iterator.throw(error)
            handlerResult()
          }
        }else{
          //同步
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