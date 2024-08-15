import path from 'node:path'
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
import esbuild from 'rollup-plugin-esbuild'
import { dts } from 'rollup-plugin-dts'
import AutoImport from 'unplugin-auto-import/rollup'
import alias from '@rollup/plugin-alias'

const commonPlugins = [alias({
  entries: {
    '@': path.resolve(import.meta.dirname, '.'),
  },
})]

// ts声明文件
const dtsConfig = defineConfig({
  input: './types/index.ts',
  plugins: [...commonPlugins, dts({ respectExternal: false })],
  output: {
    dir: 'dist/types',
    format: 'esm',
    entryFileNames: '[name].d.ts',
  },
})

// 常规打包
const normalConfig = defineConfig({
  plugins: [
    ...commonPlugins,
    json(),
    nodeResolve({
      exportConditions: ['node'],
      preferBuiltins: true,
      extensions: ['.js', '.ts', '.json'],
    }),
    commonjs({
      defaultIsModuleExports: 'auto',
    }),
    // esbuild 和 typescript2 插件同时使用时, typescript2 执行检查和声明文件生成, esbuild 进行编译.
    // https://www.npmjs.com/package/rollup-plugin-typescript2
    // ts检查
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
