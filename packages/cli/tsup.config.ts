import { defineConfig } from 'tsup'

export default defineConfig({
  format: [
    'esm',
  ],
  entry: ['./index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ['lightningcss'],
})
