import ora from 'ora'
import { log } from './log'

export * from './log'
export type * from './log'
export * from './http'
export type * from './http'

export function delay(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

interface CatalogItem {
  fileName: string
  url: string
  type: 'file' | 'dir'
  size: number
  children?: CatalogItem[]
}
export function generateCatalog(data, optionKeys = { fileName: 'path', url: 'url' }): CatalogItem[] {
  if (!data)
    return []

  // 生成目录
  function generate(data, optionKeys): CatalogItem[] {
    const catalog: CatalogItem[] = []

    for (const item of data) {
      const ele: CatalogItem = {} as CatalogItem
      if (item.children)
        ele.children = generate(item.children, optionKeys)

      catalog.push({
        type: item.type === 'blob' ? 'file' : 'dir',
        fileName: item[optionKeys.fileName],
        size: item.size,
        url: item.url,
      })
    }
    return catalog
  }
  return generate(data, optionKeys)
}

export async function oraWrapper(cb, param?, start = log._yellow('loading...'), end = log._green('success')) {
  const spinner = ora(start).start()
  let result
  cb && (result = await cb(param))
  spinner.succeed(end)
  return result
}
