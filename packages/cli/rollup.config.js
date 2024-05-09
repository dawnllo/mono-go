import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import testPlugin from './rollup-plugins/test.js'

export default defineConfig({
  plugins: [
    // testPlugin(),
    nodeResolve({
      exportConditions: ['node'],
      preferBuiltins: true,
    }),
    commonjs({
      defaultIsModuleExports: 'auto',
    }),
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
