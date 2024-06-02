import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import { cwd, exit } from 'node:process'
import path from 'node:path'
import prompts from 'prompts'
import { generateCatalog, http, log, oraWrapper } from '../utils'

export async function writeSyncFile(filePath: string, content) {
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
      fs.renameSync(filePath, newFilePath)
      filePath = newFilePath
    }
    else {
      // 退出
      exit(0)
      throw new Error(log._yellow('process exit!'))
    }
  }

  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir, { recursive: true })

  fs.writeFileSync(filePath, content)
}

// 下载
// file-blob
async function fileBlob(catalogItem: _Global.CatalogItem) {
  const { url, path } = catalogItem
  const res = await http.gitUrl(url)

  const filePath = `${cwd()}/template/${path}`
  const data = await res.json()
  const buf = Buffer.from(data.content, 'base64')
  await writeSyncFile(filePath, buf)
}
async function trees(catalogItem: _Global.CatalogItem) {
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
  try {
    for (const item of catalog) {
      item.path = `${path}/${item.path}` // tree 获取的不带 父目录.这里拼接上
      if (item.type === 'file')
        await oraWrapper(fileBlob, item, log._green(`CWD: ${item.path}`))

      else if (item.type === 'dir')
        await trees(item)
    }
  }
  catch (error) {
    // 任何一个递归文件失败, 删除该目录
    fs.rmSync(`${cwd()}/template/${path}`)
  }
}

const download = {
  fileBlob,
  trees,
}
export { download }
