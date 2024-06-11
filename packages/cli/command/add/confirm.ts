import path from 'node:path'
import { cwd } from 'node:process'
import fs from 'node:fs'
import { pro } from '../../utils'
import type MiddleWare from './middleware'

/**
 * 确定文件目标
 * 存在：用户交互，是否重写、或取消重新输入。
 * 不存在：进行下一步。
 */
export default async function confirm(this: MiddleWare, ctx) {
  const { template } = ctx

  let answer = {
    confirm: false,
    name: '',
  }
  answer = await repeatConfirm(template, answer) // 反复确认

  async function repeatConfirm(name, lastAnswer) {
    const targetPath = path.resolve(cwd(), name)
    const isExist = fs.existsSync(targetPath)

    let answer = {
      confirm: false,
      name: '',
    }
    if (isExist)
      answer = await pro.confirm_text()

    if (answer.confirm && answer.name)
      return await repeatConfirm(answer.name, answer)

    return lastAnswer
  }
  console.log(answer)
  this.cancel()
}
