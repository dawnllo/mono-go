import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [
    nodeResolve({
      preferBuiltins: true, // prefer 更新欢使用它内置的模块, 消除命令行中的警告
    }),
    commonjs({
      defaultIsModuleExports: 'auto'
    })
  ],
  input: {
    index: './index.ts',
  },
  output: [
    {
      dir: 'dist2',
      format: 'es',
      entryFileNames: '[name].mjs',
    },
    {
      dir: 'dist2',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
  ],
}) 