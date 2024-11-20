/**
 * 学习 anthony fu 的结构组织能力
 */
export interface PackageManifest {
  name: string
  display: string
  addon?: boolean // 附件说明
  author?: string
  description?: string
  external?: string[] // vueuse中配置的external,用于rollup.config.ts构建使用
  globals?: Record<string, string> // vueuse中配置的globals,用于rollup.config.ts构建使用
  manualImport?: boolean // 是否手动引入, 解决packages/components等, 约定式引入到index入口. await fs.writeFile(join(dir, 'index.ts'), `${imports.join('\n')}\n`)
  deprecated?: boolean
  submodules?: boolean // 是否存在子模块
  build?: boolean
  iife?: boolean // 是否需要打包成iife
  cjs?: boolean
  mjs?: boolean
}

export const packages: PackageManifest[] = [
  {
    name: 'dlc',
    display: 'add template by dlc cli',
    manualImport: true,
  },
]
