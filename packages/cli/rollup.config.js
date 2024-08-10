import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
import esbuild from 'rollup-plugin-esbuild'
import { dts } from 'rollup-plugin-dts'

// 单独打包声明文件
const dtsConfig = defineConfig({
  input: ['./index.ts', './global.d.ts'],
  plugins: [dts({ respectExternal: false })],
  output: {
    dir: 'dist/types',
    format: 'esm',
  },
})

// 常规打包
const normalConfig = defineConfig({
  plugins: [
    json(),
    nodeResolve({
      exportConditions: ['node'],
      preferBuiltins: true,
    }),
    commonjs({
      defaultIsModuleExports: 'auto',
    }),
    // esbuild 和 typescript2 插件同时使用时, typescript2 执行检查和声明文件生成, esbuild 进行编译.
    // https://www.npmjs.com/package/rollup-plugin-typescript2
    // typescript({
    //   useTsconfigDeclarationDir: true,
    //   clean: true,
    // }),
    esbuild({}),
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
