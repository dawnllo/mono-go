import assert from 'node:assert'
import { execSync as exec } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { consola } from 'consola'
import fg from 'fast-glob'
import fs from 'fs-extra'
import YAML from 'yaml'
import { packages } from './meta/packages'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const watch = process.argv.includes('--watch')

// 全局需要融合到dist目录中的文件
const FILES_COPY_ROOT = [
  'LICENSE',
]

// 每个模块需要融合到dist目录中的文件
const FILES_COPY_LOCAL = [
  'README.md',
  'index.json',
  '*.md',
]

assert(process.cwd() !== __dirname)

async function buildMetaFiles() {
  const workspaceData = YAML.parse(await fs.readFile(path.resolve(rootDir, 'pnpm-workspace.yaml'), 'utf-8'))

  for (const { name } of packages) {
    const packageRoot = path.resolve(rootDir, 'packages', name)
    const packageDist = path.resolve(packageRoot, 'dist')

    for (const file of FILES_COPY_ROOT)
      await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file))

    const files = await fg(FILES_COPY_LOCAL, { cwd: packageRoot })
    for (const file of files)
      await fs.copyFile(path.join(packageRoot, file), path.join(packageDist, file))

    // 检查每个模块的package.json，将本地依赖
    const packageJSON = await getPackageJson(name)
    for (const [key, value] of Object.entries(packageJSON.dependencies || {})) {
      if (key.startsWith('@dawnll/')) {
        const packageName = key.replace('@dawnll/', '')
        const { version } = await getPackageJson(packageName)
        packageJSON.dependencies[key] = version
      }
      else if ((value as string).startsWith('catalog:')) {
        const resolved = workspaceData.catalog[key as string]
        if (!resolved)
          throw new Error(`Cannot resolve catalog entry for ${key}`)
        packageJSON.dependencies[key] = resolved
      }
    }
    delete packageJSON.devDependencies
    await fs.writeJSON(path.join(packageDist, 'package.json'), packageJSON, { spaces: 2 })
  }
}

async function getPackageJson(packageName: string) {
  const packageRoot = path.resolve(rootDir, 'packages', packageName)
  const jsonPath = path.join(packageRoot, 'package.json')

  if (!await fs.pathExists(jsonPath))
    throw new Error(`Cannot find package.json for ${packageName}!`)

  return await fs.readJSON(jsonPath)
}

async function build() {
  consola.info('Rollup')
  exec(`pnpm run build:rollup${watch ? ' -- --watch' : ''}`, { stdio: 'inherit' })
  // 使用文档、开源协议、package.json版本号修改组织在一起
  await buildMetaFiles()
}

build()
