import path from 'node:path'
import fs from 'node:fs'
import { createFilter } from '@rollup/pluginutils'
import { isWindows, slash } from './utils/system'

// 获取package.json
export interface PackageData {
  dir: string
  hasSideEffects: (id: string) => boolean | 'no-treeshake' | null
  webResolvedImports: Record<string, string | undefined>
  nodeResolvedImports: Record<string, string | undefined>
  setResolvedCache: (key: string, entry: string, targetWeb: boolean) => void
  getResolvedCache: (key: string, targetWeb: boolean) => string | undefined
  data: {
    [field: string]: any
    name: string
    type: string
    version: string
    main: string
    module: string
    browser: string | Record<string, string | false>
    exports: string | Record<string, any> | string[]
    imports: Record<string, any>
    dependencies: Record<string, string>
  }
}
// TODO : 优化缓存机制
/** Cache for package.json resolution and package.json contents */
export type PackageCache = Map<string, PackageData>

export function tryStatSync(file: string): fs.Stats | undefined {
  try {
    // The "throwIfNoEntry" is a performance optimization for cases where the file does not exist
    return fs.statSync(file, { throwIfNoEntry: false })
  }
  catch {
    // Ignore errors
  }
}

// TODO : 优化缓存机制
export function findNearestPackageData(
  basedir: string,
): PackageData | null {
  while (basedir) {
    const pkgPath = path.join(basedir, 'package.json')
    if (tryStatSync(pkgPath)?.isFile()) {
      try {
        const pkgData = loadPackageData(pkgPath)
        return pkgData
      }
      catch {}
    }

    const nextBasedir = path.dirname(basedir)
    if (nextBasedir === basedir)
      break
    basedir = nextBasedir
  }

  return null
}

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}

export function loadPackageData(pkgPath: string): PackageData {
  const data = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  const pkgDir = normalizePath(path.dirname(pkgPath))
  const { sideEffects } = data
  let hasSideEffects: (id: string) => boolean | null
  if (typeof sideEffects === 'boolean') {
    hasSideEffects = () => sideEffects
  }
  else if (Array.isArray(sideEffects)) {
    if (sideEffects.length <= 0) {
      // createFilter always returns true if `includes` is an empty array
      // but here we want it to always return false
      hasSideEffects = () => false
    }
    else {
      const finalPackageSideEffects = sideEffects.map((sideEffect) => {
        /*
         * The array accepts simple glob patterns to the relevant files... Patterns like *.css, which do not include a /, will be treated like **\/*.css.
         * https://webpack.js.org/guides/tree-shaking/
         * https://github.com/vitejs/vite/pull/11807
         */
        if (sideEffect.includes('/'))
          return sideEffect

        return `**/${sideEffect}`
      })

      hasSideEffects = createFilter(finalPackageSideEffects, null, {
        resolve: pkgDir,
      })
    }
  }
  else {
    hasSideEffects = () => null
  }

  // TODO : 优化缓存机制
  const pkg: PackageData = {
    dir: pkgDir,
    data,
    hasSideEffects,
    webResolvedImports: {},
    nodeResolvedImports: {},
    setResolvedCache(key: string, entry: string, targetWeb: boolean) {
      if (targetWeb)
        pkg.webResolvedImports[key] = entry
      else
        pkg.nodeResolvedImports[key] = entry
    },
    getResolvedCache(key: string, targetWeb: boolean) {
      if (targetWeb)
        return pkg.webResolvedImports[key]
      else
        return pkg.nodeResolvedImports[key]
    },
  }

  return pkg
}
