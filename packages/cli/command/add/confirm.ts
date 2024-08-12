import type MiddleWare from './middleware'
import type { Context } from './index'
import { pro } from '@/utils/index'

/**
 * 确定文件目标
 * 存在：用户交互，是否重写、或取消重新输入。
 * 不存在：进行下一步。
 */
export default async function confirm(this: MiddleWare, ctx: Context) {
  const { args: [path] } = ctx

  const answer = await pro.repeat_confirm_text(path) // 反复确认

  if (!answer.confirm)
    this.cancel()

  // 确认answer注入的ctx
  ctx.answers.confirm = answer
}
