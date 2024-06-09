import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'

import testPlugin from './rollup-plugins/test.js'

export default defineConfig({
  plugins: [
    // testPlugin(),
    json(),
    nodeResolve({
      exportConditions: ['node'],
      preferBuiltins: true,
    }),
    commonjs({
      defaultIsModuleExports: 'auto',
    }),
    typescript(),
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
  ],
})
