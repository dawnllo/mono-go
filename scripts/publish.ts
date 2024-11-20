import { execSync } from 'node:child_process'
import path from 'node:path'
import { consola } from 'consola'
import { packages } from './meta/packages'

execSync('pnpm run build', { stdio: 'inherit' })

const command = 'pnpm publish --access public'

for (const { name } of packages) {
  execSync(command, { stdio: 'inherit', cwd: path.join('packages', name, 'dist') })
  consola.success(`Published @dawnll/${name}`)
}
