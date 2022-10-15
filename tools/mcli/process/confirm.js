import path from 'path'
import prompts from 'prompts'
import { file } from '../core/file'

/**
 * 确定文件目标是否存在
 */
export default async (ctx) => {
  ctx.dest = path.resolve(ctx.project)

  const exists = await file.exists(ctx.dest)

  if (exists === false) return

  if (exists === 'file'|| exists === 'other') throw new Error(`Cannot create ${ctx.project}: File exists.`)

  // else dir
  if (await file.isDirEmpty(ctx.dest)) return

  const isCurrent = ctx.dest === process.cwd()

  const { choose } = await prompts([
    {
      name: 'sure',
      type: 'confirm',
      message: isCurrent ? 'Create in current directory?' : 'Target directory already exists. Continue?'
    },
    {
      name: 'choose',
      type: (prev) => prev ? 'select' : null,
      message: `${isCurrent ? 'Current' : 'Target'} directory is not empty. How to continue?`,
      hint: ' ',
      choices: [
        { title: 'Merge', value: 'merge' },
        { title: 'Overwrite', value: 'overwrite' },
        { title: 'Cancel', value: 'cancel' }
      ]
    }
  ])

  if (choose == null || choose === 'cancel') throw new Error('You have cancelled this task.')

  if (choose === 'overwrite') await file.remove(ctx.dest)

}
