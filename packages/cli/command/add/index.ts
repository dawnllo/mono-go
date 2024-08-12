import chalk from 'chalk'
import MiddleWare from './middleware'
import load from './load'
import confirm from './confirm'
import { errorWrapper } from '@/config/error'
import type { PRepeatConfirmText } from '@/utils/index'
import type { ConfigFile } from '@/types'

export interface Context {
  args: any[] // 命令行参数
  configFile: ConfigFile // 获取模板，读取require
  answers: {
    confirm: PRepeatConfirmText
  }
}

const app = new MiddleWare()

// 先确认, 在加载
app
  .use(confirm)
  .use(load)

async function addAction(configFile: ConfigFile, _args) {
  const [path] = _args
  if (!path)
    throw new Error(chalk.red('Missing require argument: `tempalte`.'))

  const context: Context = {
    args: _args,
    answers: {
      confirm: {
        confirm: false,
        isRenamed: false,
        name: '',
      },
    },
    configFile,
  }

  await app.run(context)
}

export default errorWrapper(addAction)
