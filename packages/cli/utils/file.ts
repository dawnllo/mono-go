import fs from 'node:fs'
import path from 'node:path'
import { log, pro } from '../utils'

const file_config: _Global.FileConfig = {
  removeWhiteList: [],
}

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
 * @param filePath
 * @returns
 */
export async function rmSyncFile(filePath: string) {
  console.log('rmSyncFile', filePath)

  // 1.验证是否满足白名单
  if (!file_config.removeWhiteList.includes(filePath))
    return log._red('file path not in whiteList, exit!!!')
  if (fs.existsSync(filePath)) {
    // 2.交互提示文件路径, 并confirm.
    const result = await pro.confirm(log._red(`delete file or directory, ${filePath}?`))
    result.confirm && fs.rmSync(filePath, { recursive: true })
  }
}

/**
 * 删除当前文件夹下的空文件夹
 * @param curDir
 * @returns
 */
export async function rmEmptyDir(curDir: string) {
  // 1.验证是否满足白名单
  if (!file_config.removeWhiteList.includes(curDir))
    return log._red('file path not in whiteList, exit!!!')

  // 2.不存在退出
  if (!fs.existsSync(curDir))
    return

  // 3.不是文件夹退出
  if (!fs.statSync(curDir).isDirectory())
    return

  // 4.操作当前文件
  const curDirFiles = fs.readdirSync(curDir)

  for (const file of curDirFiles) {
    const nextPath = path.join(curDir, file)
    if (fs.statSync(nextPath).isDirectory())
      await rmEmptyDir(nextPath)
  }

  // 5.从内层向外删除.
  if (curDirFiles.length === 0)
    return fs.rmSync(curDir)
}

export const file = {
  init,
  writeSyncFile,
  rmSyncFile,
  rmEmptyDir,
}
