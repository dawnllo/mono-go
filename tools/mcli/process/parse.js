import path from 'path'
import chalk from 'chalk'

function delay(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, timeout);
  })
}

/**
 * 解析template
 * @param {*} ctx 上下文
 */
export default async function parseTemplatePath(ctx) {
  // await delay(3000)
  console.log(chalk.green('parse to do'), chalk.cyan(JSON.stringify(ctx)))

  // parse template
  let resultTemp
  const temp = ctx.template

}
