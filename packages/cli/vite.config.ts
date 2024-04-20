import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // 待了解，vite报警告的问题。

export default defineConfig({
  // plugins: [nodePolyfills()],

  build: {
    minify: false,
    commonjsOptions: {
      include: /node_modules/,
    },
    lib: {
      entry: ['./index.ts'],
      formats: ['es', 'cjs'],
      fileName: (format, entryAlias) => {
        if(format === 'es') return `${entryAlias}.mjs`
        if(format === 'cjs') return `${entryAlias}.cjs`
      }
    },
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      // input: {
      //   index: './index.ts',
      // },
      // output: [
      //   {
      //     dir: 'dist',
      //     format: 'es',
      //     entryFileNames: '[name].mjs',
      //   },
      //   {
      //     dir: 'dist',
      //     format: 'cjs',
      //     entryFileNames: '[name].cjs',
      //   },
      // ],
    },
  },
})
