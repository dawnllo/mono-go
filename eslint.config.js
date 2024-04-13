// 跟上 antfu 的最佳实践.
import antfu from '@antfu/eslint-config'

// 内部通过 local-pak 自动判断是vue/typescript.
export default antfu({
  isInEditor: true,
  unocss: true,
  typescript: true,
  overrides: {
    stylistic: {
      'eol-last': 'error',
      'no-console': 'off',
    },
  },
})
