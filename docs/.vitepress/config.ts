import { defineConfig } from 'vitepress'
import { getPackageSide } from '../utils'

export default defineConfig({
  title: 'do.while',
  lang: 'en-ZH',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'Template', items: [
        { text: 'Element v2', link: '/element-v2' },
        { text: 'Element v3', link: '/element-v3' },
      ] },
    ],

    sidebar: {
      '/guide': [
        {
          text: 'guide',
          items: [
            { text: 'Get Started', link: '/guide/' },
            { text: 'Configurations', link: '/guide/config' },
          ],
        },
      ],
      '/element-v2': [
        { text: 'Components', items: getPackageSide('v2') },
        { text: 'Hooks', items: getPackageSide('v2') },
      ],
      '/element-v3': [
        {
          text: 'Components',
          // collapsed: true,
          items: [
            { text: 'List', link: '/element-v3/api-examples' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dawnllo/mono-go' },
    ],
  },
})
