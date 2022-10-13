import path from 'path'
import chalk from 'chalk'



/**
 * 解析template
 * @param {*} ctx 上下文
 */
export default async function parseTemplatePath(ctx) {
  console.log(chalk.green('parse to do'), chalk.cyan(JSON.stringify(ctx)))

  // parse template
  let resultTemp
  const temp = ctx.template

}
