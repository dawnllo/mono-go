const middleWare = (function (){
  const QUEUES = Symbol('执行队列')
  
  return class middleWare {
    [QUEUES] = [] 
    
    construction () {
    }

    use(fn) {
      if(typeof fn !== "function") throw "please pass a function"
      // 考虑是否bind
      this[QUEUES].push(fn)
      return this
    }

    run() {
      const iterator = this.generator()
      let result = iterator.next()
      handlerResult()
      
      //tools
      function handlerResult() {
        if (result.done) {
          return 
        }

        const res = result.value.call(this, this.context)

        // Promise
        if(typeof res.then === "function"){
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