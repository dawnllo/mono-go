import { defineConfig } from 'rollup';

export default defineConfig(
  {
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
  }
) 