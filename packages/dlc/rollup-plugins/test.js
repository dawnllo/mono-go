export default function test() {
  return {
    name: 'test',
    resolveId: {
      async handler(importee, importer, resolveOptions) {
        console.log(123, importee, importer, resolveOptions)
      },
    },
  }
}
