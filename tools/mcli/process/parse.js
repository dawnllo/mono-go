
function delay(duration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, duration);
  })
}

export default async function parse(ctx) {
  await delay(2000)
  console.log('todo parse job')
}