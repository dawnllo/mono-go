/**
 * 延迟函数
 * @param {*} timeout 延迟时间
 * @returns
 */
export function delay(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, timeout)
  })
}
