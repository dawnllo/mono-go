import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // 待了解，vite报警告的问题。

export default defineConfig({
  // plugins: [nodePolyfills()],

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
