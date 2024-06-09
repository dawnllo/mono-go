import fs from 'node:fs'
import { cwd } from 'node:process'
import path from 'node:path'
import { log, pro } from '../utils'

type FileConf = Pick<_Global.ConfigFile, 'removeWhitePath' | 'rootAP'>
const file_config: FileConf = {
  rootAP: '',
  removeWhitePath: [],
}

/**
 * 初始化文件操作系统 - 需要的配置内容
 * @param configFile 全局配置文件
 */
export function init(configFile) {
  Object.keys(file_config).forEach((key) => {
    file_config[key] = configFile[key]
  })
}
/**
 * 生成文件
 * @param filePath
 * @param content
 * @returns 返回完整绝对路径,或则重名后的绝对路径
 */
export async function writeSyncFile(filePath: string, content): Promise<string> {
  if (fs.existsSync(filePath)) {
    const file = path.basename(filePath)
    // 交互
    const result = await pro.confirm_text(log._red(`${file} already exists, rename?`))

    if (result.confirm && result.name) {
      // 重命名
      const extname = path.extname(filePath)
      const newFilePath = path.join(path.dirname(filePath), result.name + extname)
      filePath = newFilePath
    }
    else {
      throw new Error('file already exists, exit!!!')
    }
  }

  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir, { recursive: true })

  fs.writeFileSync(filePath, content)

  return filePath
}

/**
 * 删除文件
 * @param input
 * @returns
 */
export async function rmSyncFile(input: string) {
  if (!rmSyncValidate(input))
    return

  // 2.交互提示文件路径, 并confirm.
  const result = await pro.confirm(log._red(`delete file or directory, ${input}?`))
  result.confirm && fs.rmSync(input, { recursive: true })
  log.green('delete success')
}

/**
 * 删除空文件夹
 * @param input
 * @returns
 */
export async function rmSyncEmptyDir(input: string) {
  if (!rmSyncValidate(input))
    return

  if (!fs.statSync(input).isDirectory())
    return

  const curDirFiles = fs.readdirSync(input)
  for (const file of curDirFiles) {
    const nextPath = path.join(input, file)
    if (fs.statSync(nextPath).isDirectory())
      await rmSyncEmptyDir(nextPath)
  }

  // 从内层向外删除.
  if (curDirFiles.length === 0)
    return fs.rmSync(input)
}

/**
 * 删除验证
 * @param input
 * @returns boolean
 */
function rmSyncValidate(input) {
  const whiteList = file_config.removeWhitePath
  let isPass = false
  for (const white of whiteList) {
    if (input.startsWith(white)) {
      isPass = true
      break
    }
  }

  if (!isPass) {
    log._red('file path not in whiteList, exit!!!')
    return false
  }

  if (!fs.existsSync(input))
    return false

  return true
}

export const file = {
  init,
  writeSyncFile,
  rmSyncFile,
  rmSyncEmptyDir,
}
