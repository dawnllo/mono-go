import { defineConfig } from 'vitepress'
import { createPackageLinksSide } from '../utils/createPackageLinksSide'

export default async function () {
  const [v3Sidebar] = await Promise.all([
    createPackageLinksSide('element-v3'),
  ])

  return defineConfig({
    title: 'do.while',
    lang: 'en-ZH',
    cleanUrls: true,
    rewrites: {
      'packages/:pkg/:index': ':pkg/:index',
      'packages/:pkg/components/:comp': ':pkg/components/:comp',
    },

    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide' },
        { text: 'Template', items: [
          { text: 'Element v2', link: '/element-v2' },
          { text: 'Element v3', link: '/element-v3/components/List' },
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
        // '/element-v2': v2Items, // TODO use dynamic sidebar
        '/element-v3': v3Sidebar,
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/dawnllo/mono-go' },
      ],
    },
  })
}
