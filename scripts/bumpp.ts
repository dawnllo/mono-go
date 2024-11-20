import { execSync } from 'node:child_process'
import process from 'node:process'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { parseArgs } from './utils.ts'

// const result = parseArgs()

// 配置bumpp, 哪些files需要更新版本号
const oldVersion = fs.readJSONSync('package.json').version
execSync('bumpp --no-commit --no-tag --no-push', { stdio: 'inherit' })
const newVersion = fs.readJSONSync('package.json').version

if (oldVersion === newVersion) {
  console.log('no version change')
  process.exit(0)
}

// 更新完版本号后，更新meta/versions.ts
const files = await fg([
  'packages/*/package.json',
], {
  onlyFiles: true,
})

const meta = {}
for (const f of files) {
  const { version } = await fs.readJSONSync(f)
  const packName = f.replace(/packages[\\/](.*)[\\/]package.json/, '$1')
  meta[packName] = version
}

let versions = {}
if (fs.existsSync('./scripts/meta/versions.ts')) {
  // @ts-ignore
  const { versions: orgV = {} } = await import('./meta/versions.ts')
  versions = orgV
}

for (const key in meta) {
  const v = versions[key] = versions[key] ?? []
  if (Object.hasOwnProperty.call(meta, key)) {
    v.unshift(meta[key])
  }
}

const content = `export const versions = ${JSON.stringify(versions, null, 2)}`
fs.writeFileSync('./scripts/meta/versions.ts', content, 'utf-8')
execSync('eslint --fix ./scripts/meta/versions.ts', { stdio: 'inherit' })

// 版本更新同步到git
execSync('git add .', { stdio: 'inherit' })
execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: 'inherit' })
execSync(`git tag -a v${newVersion} -m "v${newVersion}"`, { stdio: 'inherit' })
