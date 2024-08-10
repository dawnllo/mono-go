import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
import esbuild from 'rollup-plugin-esbuild'

export default defineConfig({
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
    typescript({
      useTsconfigDeclarationDir: true,
      clean: true,
    }),
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
