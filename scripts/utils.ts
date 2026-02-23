import { join, resolve } from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import cac from 'cac'
import type { PackageManifest } from './meta/packages'

export const DOCS_URL = 'https://dawnll.org'
export const DIR_SRC = resolve(__dirname, '../packages')

export async function updatePackageJSON(packages: PackageManifest[]) {
  const { version } = await fs.readJSON('package.json')

  for (const { name, description, author } of packages) {
    const packageDir = join(DIR_SRC, name)
    const packageJSONPath = join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    packageJSON.description = description || packageJSON.description
    packageJSON.author = author || 'dawanll <https://github.com/dawanll>'
    packageJSON.bugs = {
      url: 'https://github.com/dawanll/mono-go/issues',
    }
    packageJSON.homepage = name === 'core'
      ? 'https://github.com/dawanll/mono-go#readme'
      : `https://github.com/dawanll/mono-go/tree/main/packages/${name}#readme`
    packageJSON.repository = {
      type: 'git',
      url: 'git+https://github.com/dawanll/mono-go.git',
      directory: `packages/${name}`,
    }

    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
  }
}

export function uniq<T extends any[]>(a: T) {
  return Array.from(new Set(a))
}

/**
 * 利用cac库解析命令行参数
 * result.args: 获取未匹配的命令行参数
 * result.options: 获取匹配的命令行参数
 * result.rawArgs: 获取原始命令行参数process.argv
 * result.options['--']: -- 是指cac中， -- 后面的不会被作为指令。
 * @param argv
 * @returns
 */
interface ParseArgsResult {
  '--': string[]
  'matchArgs': Record<string, any>
  'noMatchArgs': Record<string, any>
}
export function parseArgs(argv = process.argv): ParseArgsResult {
  const cli = cac('tools')
  const result = cli.parse(argv)
  const noMatchArgs = result.args // 获取未匹配的命令行参数
  const matchArgs = result.options

  return {
    '--': result.options['--'] || [],
    matchArgs,
    noMatchArgs,
  }
}
