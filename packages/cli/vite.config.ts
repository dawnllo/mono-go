import { defineConfig } from 'vite'

// 先熟悉 rollup 构建 脚手架. 待 rolldown 稳定后, 尝试使用 vite 构建.
export default defineConfig({
  build: {
    minify: false,
    commonjsOptions: {
      include: /node_modules/,
    },
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      input: {
        index: './index.ts',
      },
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
        },
      ],
    },
  },
})
