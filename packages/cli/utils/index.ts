import ora from 'ora'
import { log } from './log'

export * from './log'
export type * from './log'
export * from './http'
export type * from './http'
export * from './file'
export type * from './file'

export function delay(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

export function generateCatalog(data, optionKeys = { path: 'path', url: 'url' }): _Global.CatalogItem[] {
  if (!data)
    return []

  // 生成目录
  const catalog: _Global.CatalogItem[] = []

  for (const item of data) {
    const ele: _Global.CatalogItem = {
      path: item[optionKeys.path],
      url: item[optionKeys.url],
      type: item.type === 'blob' ? 'file' : 'dir',
      size: item.size,
      sha: item.sha,
    }
    catalog.push(ele)
  }

  return catalog
}

export async function oraWrapper(cb, param?, start = log._yellow('loading...'), end = log._green('success')) {
  const spinner = ora(start).start()
  let result
  cb && (result = await cb(param))
  spinner.succeed(end)
  return result
}
