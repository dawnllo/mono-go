import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import { cwd, exit } from 'node:process'
import path from 'node:path'
import prompts from 'prompts'
import ora from 'ora'
import { generateCatalog, http, log, oraWrapper } from '../utils'

/**
 * 生成文件
 * @param filePath
 * @param content
 * @returns 返回完整绝对路径,或则重名后的绝对路径
 */
export async function writeSyncFile(filePath: string, content): Promise<string> {
  if (fs.existsSync(filePath)) {
    const file = path.basename(filePath)
    // TODO prompt
    const promptsConfig = [{
      type: 'confirm',
      name: 'override',
      message: log._red(`${file} already exists, override?`),
      initial: false,
    }, {
      type: (confirm) => {
        return confirm ? 'text' : null
      },
      name: 'renames',
      validate(input) {
        return input === '' ? 'rename is required' : true
      },
      message: `enter rename !`,
    }]
    // 交互
    const result = await prompts(promptsConfig)

    if (result.override && result.renames) {
      // 重命名
      const extname = path.extname(filePath)
      const newFilePath = path.join(path.dirname(filePath), result.renames + extname)
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

// 下载
// file-blob
async function fileBlob(catalogItem: _Global.CatalogItem) {
  const { url, path } = catalogItem

  const spinner = ora(log._green(`template/${path}`)).start()
  const res = await http.gitUrl(url)
  const data = await res.json()
  spinner.stop()

  const filePath = `${cwd()}/template/${path}`
  const buf = Buffer.from(data.content, 'base64')
  let finishPath
  try {
    finishPath = await writeSyncFile(filePath, buf)
  }
  catch (error) {
    throw new Error('writeSyncFile error.')
  }

  spinner.succeed(log._green(`template/${path}, success.`))
  return finishPath
}

let _level = 0 // 递归层级
async function trees(catalogItem: _Global.CatalogItem): Promise<string[]> {
  _level++
  const { sha, path } = catalogItem
  // 循环下载
  const config = {
    owner: 'Dofw',
    repo: 'vs-theme',
    type: _Global.GitFetchType.trees,
    sha,
  }
  const res = await http.git(config)
  const json = await res.json()

  const catalog = generateCatalog(json.tree)
  const finishPath: string[] = []
  try {
    for (const item of catalog) {
      item.path = `${path}/${item.path}` // tree 获取的不带 父目录.这里拼接上
      if (item.type === 'file') {
        const finish = await fileBlob(item)
        finishPath.push(finish)
      }

      else if (item.type === 'dir') {
        const finishs = await trees(item)
        finishPath.push(...finishs)
      }
    }
  }
  catch (error) {
    // TODO: fs 删除操作, 封装安全🚫. 例如: 指定可删除的项目目录前缀,其余一律throw.
    // 任何一个递归已经下载的文件
    for (const filePath of finishPath) {
      fs.rmSync(`${filePath}`)
      log.red(`delete ${filePath}`)
    }
    // 起始层, 不需要报错; // TODO: 同时将空文件夹删除.
    if (_level > 1)
      throw new Error('download trees error.')
  }
  finally {
    _level-- // 执行完一层减1, 回归init
  }

  return finishPath
}

const download = {
  fileBlob,
  trees,
}
export { download }
