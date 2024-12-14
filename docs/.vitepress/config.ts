import { defineConfig } from 'vitepress'
import { getPackageSide } from '../utils'

const pkgName = {
  v2: 'element-v2',
  v3: 'element-v3',
}

export default async function () {
  const [v2Items, v3Items] = await Promise.all([
    getPackageSide(pkgName.v2),
    getPackageSide(pkgName.v3),
  ])

  console.log(v2Items, v3Items)

  return defineConfig({
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
        '/element-v2': v2Items,
        // '/element-v3': v3Items,
        '/element-v3': [
          {
            text: 'components',
            items: [
              {
                text: 'List',
                link: '/element-v3/components/List',
              },
              {
                text: 'Upload',
                link: '/element-v3/components/Upload',
              },
            ],
          },
        ],
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/dawnllo/mono-go' },
      ],
    },
  })
}
