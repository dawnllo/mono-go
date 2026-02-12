import { execSync } from 'node:child_process'
import process from 'node:process'
import fs from 'fs-extra'
import fg from 'fast-glob'
import prompts from 'prompts'


import { consola } from 'consola'



const pkgs = [
  'dlc',
  'element-v2',
  'element-v3',
]

const {selects} = await prompts({
  type: 'autocompleteMultiselect',
  name: 'selects',
  initial: 0,
  limit: 100,
  optionsPerPage: 100,
  fallback: 'no match!',
  instructions: false,
  message: 'Select packages to bump',
  choices: pkgs.map((pkg) => {
    return {
      title: pkg,
      value: pkg
    }
  }),
  onState: () => {
    consola.success(`--onState--`)
  }
})

const allUpState: boolean[] = []
for (const pkg of selects) {
  console.log(pkg)
  const isUp = await updateVersion(pkg)
  allUpState.push(isUp)
  if(!isUp) {
    console.log(`${pkg} no version change`)
    continue
  }
}

if (allUpState.every((isUp) => isUp === false)) {
  console.log(`no version change`)
  process.exit(0)
}

// 更新版本号
function updateVersion(pkg) : boolean {
  const pkgPath = `packages/${pkg}/package.json`
  if (!fs.existsSync(pkgPath)) {
    console.log(`${pkgPath} not exist!`)
    process.exit(1)
  }
  const oldVersion = fs.readJSONSync(pkgPath).version
  execSync(`bump ${pkgPath}`, { stdio: 'inherit' })
  const newVersion = fs.readJSONSync(pkgPath).version
  return oldVersion !== newVersion
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
  v.unshift(meta[key])
}

const content = `export const versions = ${JSON.stringify(versions, null, 2)}`
fs.writeFileSync('./scripts/meta/versions.ts', content, 'utf-8')
execSync('eslint --fix ./scripts/meta/versions.ts', { stdio: 'inherit' })

// 版本更新同步到git
// execSync('git add .', { stdio: 'inherit' })
// execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: 'inherit' })
// execSync(`git tag -a v${newVersion} -m "v${newVersion}"`, { stdio: 'inherit' })
