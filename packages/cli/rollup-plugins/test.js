export default function test() {
  return {
    name: 'test',
    resolveId: {
      async handler(importee, importer, resolveOptions) {
        if (importee.includes('chalk')) {
          console.log(importee)
          console.log(345, resolveOptions.custom)
        }
      },
    },
  }
}
