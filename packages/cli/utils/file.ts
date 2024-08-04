import fs from 'node:fs'
import path from 'node:path'
import { log, pro } from '../utils'
import { defaultConfig } from '../config/constant'

export type WriteFileSyncRestParams = ExcludeFirstParams<Parameters<typeof fs.writeFileSync>>

const fileConfig: _Global.ConfigFile_File = defaultConfig.file

/**
 * 初始化文件操作系统 - 需要的配置内容
 * @param configFile 全局配置文件
 */
function init(configFile: _Global.ConfigFile): void {
  const dlcFileConfig = configFile.file

  Object.keys(fileConfig).forEach((key) => {
    fileConfig[key] = dlcFileConfig[key]
  })
}
/**
 * 生成文件
 * @param input 绝对路径
 * @param content
 * @returns 返回完整绝对路径,或则重名后的绝对路径
 */
async function writeFileSync(input: string, restParams: WriteFileSyncRestParams): Promise<string> {
  if (fs.existsSync(input)) {
    // 交互
    const repeat_confirm_text = pro.repeatFactory(log._red(`file already exists, rename?`))
    const result = await repeat_confirm_text(input)

    if (result.confirm && result.name)
      input = pathRename(input, result.name)
    else
      throw new Error('file already exists, exit!!!')
  }

  const dir = path.dirname(input)
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir, { recursive: true })

  fs.writeFileSync(input, ...restParams)

  return input
}

/**
 *
 * @param input
 * @param name
 * @returns
 */
function pathRename(input: string, name: string): string {
  const extname = path.extname(input)
  const newFilePath = path.join(path.dirname(input), name + extname)
  return newFilePath
}

/**
 * 删除文件
 * @param input 绝对路径
 * @returns
 */
async function rmSyncFile(input: string): Promise<void> {
  if (!rmSyncValidate(input))
    return

  let promptResult = {
    confirm: false,
  }
  // 1.提示文件路径,确认是否删除
  promptResult = await pro.confirm(log._red(`delete file or directory, ${input}?`))

  // 2.有内容的文件夹,确认是否删除
  if (fs.statSync(input).isDirectory()) {
    const curDirFiles = fs.readdirSync(input)

    if (curDirFiles.length > 0)
      promptResult = await pro.confirm(log._red(`directory is not empty, confirm delete?`))
  }

  promptResult.confirm && fs.rmSync(input, { recursive: true })
  log.green('delete success')
}

/**
 * 删除空文件夹
 * @param input绝对路径
 * @returns
 */
async function rmSyncEmptyDir(input: string): Promise<void> {
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
 * @param input 绝对路径
 * @returns boolean
 */
function rmSyncValidate(input: string): boolean {
  const whiteList = fileConfig.removeWhitePath
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

interface FileMethods {
  init: (...args: Parameters<typeof init>) => ReturnType<typeof init>
  writeFileSync: (...args: Parameters<typeof writeFileSync>) => ReturnType<typeof writeFileSync>
  rmSyncFile: (...args: Parameters<typeof rmSyncFile>) => ReturnType<typeof rmSyncFile>
  rmSyncEmptyDir: (...args: Parameters<typeof rmSyncEmptyDir>) => ReturnType<typeof rmSyncEmptyDir>
  pathRename: (...args: Parameters<typeof pathRename>) => ReturnType<typeof pathRename>
}

export const file: FileMethods = {
  init,
  writeFileSync,
  rmSyncFile,
  rmSyncEmptyDir,
  pathRename,
}
