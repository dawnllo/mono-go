import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // 待了解，vite报警告的问题。

export default defineConfig({
  plugins: [nodePolyfills()],

  build: {
    minify: false,
    rollupOptions: {
      input: {
        index: './test.ts',
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
    },
  },
})
