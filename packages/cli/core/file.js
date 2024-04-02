import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'
import AdmZip from 'adm-zip'

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
  catch (err) {
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

/**
 * Make directory recursive.
 * require node >= v10.12
 * @param input input path
 * @param options recursive by default
 */
export async function mkdir(input, options) {
  await fs.promises.mkdir(input, { recursive: true, ...options })
}

/**
 * Remove input dir or file. recursive when dir
 * require node >= v14.14.0
 * @param input input path
 * @param options recursive & force by default
 * @todo https://github.com/sindresorhus/trash
 */
export async function remove(input, options) {
  await fs.promises.rm(input, { recursive: true, force: true, ...options })
}

/**
 * Read file as a buffer.
 * @param input file name
 */
export async function read(input) {
  return await fs.promises.readFile(input)
}

/**
 * Write file with mkdir recursive.
 * @param input file name
 * @param contents file contents
 */
export async function write(input, contents) {
  await mkdir(path.dirname(input))
  return await fs.promises.writeFile(input, contents)
}

/**
 * Detect buffer is binary.
 * @param input buffer
 */
export function isBinary(input) {
  // Detect encoding
  // 65533 is the unknown char
  // 8 and below are control chars (e.g. backspace, null, eof, etc)
  return input.some(item => item === 65533 || item <= 8)
}

/**
 * Tildify absolute path.
 * @param input absolute path
 * @see https://github.com/sindresorhus/tildify
 */
export function tildify(input) {
  const home = os.homedir()

  // https://github.com/sindresorhus/tildify/issues/3
  input = path.normalize(input) + path.sep

  if (input.indexOf(home) === 0)
    input = input.replace(home + path.sep, `~${path.sep}`)

  return input.slice(0, -1)
}

/**
 * Untildify tilde path. ~
 * @param input tilde path
 * @see https://github.com/sindresorhus/untildify
 */
export function untildify(input) {
  const home = os.homedir()

  input = input.replace(/^~(?=$|\/|\\)/, home)

  return path.normalize(input)
}

/**
 * Extract zip file.
 * @param input input path or stream
 * @param output output path
 * @param strip strip output path
 * @see https://github.com/shinnn/node-strip-dirs
 */
export async function extract(input, output, strip = 0) {
  return await new Promise((resolve) => {
    const zip = new AdmZip(input)

    strip === 0
    || zip.getEntries().forEach((entry) => {
      const items = entry.entryName.split(/\/|\\/)
      const start = Math.min(strip, items.length - 1)
      const stripped = items.slice(start).join('/')
      entry.entryName = stripped === '' ? entry.entryName : stripped
    })

    // https://github.com/cthackers/adm-zip/issues/389
    // https://github.com/cthackers/adm-zip/issues/407#issuecomment-990086783
    // keep original file permissions
    zip.extractAllToAsync(output, true, true, (err) => {
      /* istanbul ignore if */
      if (err != null)
        throw err
      resolve()
    })
  })
}
