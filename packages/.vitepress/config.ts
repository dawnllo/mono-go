import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { createPackageLinksSide } from '../docs/utils/createPackageLinksSide'
import watchPkgDocs from './plugins/watchPackages'

const pluginTest = watchPkgDocs()

const rps = {
  docRoot: fileURLToPath(new URL('../_docs', import.meta.url)),
  v3comp: fileURLToPath(new URL('../element-v3/components', import.meta.url)),
}

export default async function () {
  const [v2Sidebar, v3Sidebar, guide] = await Promise.all([
    createPackageLinksSide('element-v2'),
    createPackageLinksSide('element-v3'),
    createPackageLinksSide('docs/guide')
  ])

  // console.log(JSON.stringify(v3Sidebar, null, 2))

  return defineConfig({
    title: 'do.while',
    lang: 'en-ZH',
    cleanUrls: true,
    vite: {
      resolve: {
        alias: {
          '@v3comp': rps.v3comp,
          '@docs': rps.docRoot,
        },
      },
      plugins: [pluginTest],
    },
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/docs/guide/', activeMatch: '/guide/'},
        { text: 'Template', activeMatch: '/element-v3|element-v2/',items: [
            { text: 'Element v2', link: '/element-v2/' , activeMatch: '/element-v2/'},
            { text: 'Element v3', link: '/element-v3/components/List/' ,activeMatch: '/element-v3/'},
          ]
        },
      ],
      sidebar: {
        '/element-v2': v2Sidebar,
        '/element-v3': v3Sidebar,
        '/docs/guide': guide
      },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/dawnllo/mono-go' },
      ],
    },
  })
}
