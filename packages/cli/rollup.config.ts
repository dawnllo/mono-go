import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
import esbuild from 'rollup-plugin-esbuild'
import { dts } from 'rollup-plugin-dts'
import alias from '@rollup/plugin-alias'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url)).toString(),
)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commonPlugins = [
  alias({
    entries: {
      '@': path.resolve(__dirname, '.'),
    },
  }),
  nodeResolve({
    exportConditions: ['node'],
    preferBuiltins: true,
    extensions: ['.js', '.ts', '.json'],
  }),
]

// ts声明文件
const dtsConfig = defineConfig({
  input: './types/index.ts',
  output: {
    dir: 'dist/types',
    format: 'esm',
    entryFileNames: '[name].d.ts',
  },
  external: [
    ...Object.keys(pkg.dependencies || {}).filter(d => d !== 'chalk'),
    // lightningcss types are bundled
    ...Object.keys(pkg.devDependencies || {}).filter(d => d !== 'lightningcss'),
  ],
  plugins: [...commonPlugins, dts({ respectExternal: true })],
})

// 常规打包
const normalConfig = defineConfig({
  plugins: [
    ...commonPlugins,
    json(),

    commonjs({
      defaultIsModuleExports: 'auto',
    }),
    // esbuild 和 typescript2 插件同时使用时, typescript2 执行检查和声明文件生成, esbuild 进行编译.
    // https://www.npmjs.com/package/rollup-plugin-typescript2
    // ts检查/声明文件生成
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          declarationDir: null,
        },
      },
      useTsconfigDeclarationDir: true,
      clean: true,
    }),
    // ts构建
    esbuild(),
  ],
  input: {
    index: './index.ts',
  },
  output: [
    {
      dir: 'dist',
      format: 'es',
      entryFileNames: '[name].mjs',
    },
    {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
  ],
})

export default defineConfig([
  dtsConfig,
  normalConfig,
])
