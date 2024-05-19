import fs from 'node:fs'
import path from 'node:path'

/**
 * 判断path指的对象
 * @param input input path
 * @return dir、file、other、false
 */
export async function exists(input) {
  try {
    const stat = await fs.promises.stat(input)
    if (stat.isDirectory())
      return 'dir'
    else if (stat.isFile())
      return 'file'
    else
      return 'other'
  }
  catch (err: any) {
    if (err.code !== 'ENOENT') {
      // enoent 文件或目录不存在。
      throw err
    }
    return false
  }
}

export async function isFile(input) {
  const result = await exists(input)
  return result === 'file'
}

export async function isDirectory(input) {
  const result = await exists(input)
  return result === 'dir'
}

export async function isDirEmpty(input) {
  const files = await fs.promises.readdir(input)
  return files.length === 0
}

export async function mkdir(input, options?) {
  await fs.promises.mkdir(input, { recursive: true, ...options })
}

export async function remove(input, options?) {
  await fs.promises.rm(input, { recursive: true, force: true, ...options })
}

export async function read(input) {
  return await fs.promises.readFile(input)
}

export async function write(input, contents) {
  await mkdir(path.dirname(input))
  return await fs.promises.writeFile(input, contents)
}
