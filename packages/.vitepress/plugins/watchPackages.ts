import fs from 'node:fs'
import path from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import type { PluginOption } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default function watchPkgDocs(): PluginOption {
  return {
    name: 'watch-packages-docs',
    apply: 'serve',
    async buildStart() {

    },
  }
}
