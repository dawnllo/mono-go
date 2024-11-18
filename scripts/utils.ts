import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import matter from 'gray-matter'
import YAML from 'js-yaml'
import { $fetch } from 'ofetch'
import Git from 'simple-git'
import { packages } from './meta/packages'
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

// export async function updateImport({ packages, functions }: PackageIndexes) {
//   for (const { name, dir, manualImport } of Object.values(packages)) {
//     if (manualImport)
//       continue

//     let imports: string[]
//     if (name === 'components') {
//       imports = functions
//         .sort((a, b) => a.name.localeCompare(b.name))
//         .flatMap((fn) => {
//           const arr: string[] = []

//           // don't include integration components
//           if (fn.package === 'integrations')
//             return arr

//           if (fn.component)
//             arr.push(`export * from '../${fn.package}/${fn.name}/component'`)
//           if (fn.directive)
//             arr.push(`export * from '../${fn.package}/${fn.name}/directive'`)
//           return arr
//         })
//     }
//     else {
//       imports = functions
//         .filter(i => i.package === name)
//         .map(f => f.name)
//         .sort()
//         .map(name => `export * from './${name}'`)
//     }

//     if (name === 'core') {
//       imports.push(
//         'export * from \'./types\'',
//         'export * from \'@vueuse/shared\'',
//         'export * from \'./ssr-handlers\'',
//       )
//     }

//     if (name === 'nuxt') {
//       imports.push(
//         'export * from \'@vueuse/core\'',
//       )
//     }

//     await fs.writeFile(join(dir, 'index.ts'), `${imports.join('\n')}\n`)

//     // temporary file for export-size
//     await fs.remove(join(dir, 'index.mjs'))
//   }
// }
