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
export default async function confirm(this: MiddleWare, ctx: _Global.Context) {
  const { template } = ctx

  let answer = {
    confirm: false,
    name: '',
  }
  answer = await pro.repeat_confirm_text(template, answer) // 反复确认

  if (!answer.confirm)
    this.cancel()

  // 确认answer注入的ctx
  ctx.answers.confirm = answer
}
