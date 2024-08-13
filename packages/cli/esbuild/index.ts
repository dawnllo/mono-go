import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { performance } from 'node:perf_hooks'
import { builtinModules, createRequire } from 'node:module'

import { build } from 'esbuild'

export const DEFAULT_CONFIG_FILES = [
  'vite.config.js',
  'vite.config.mjs',
  'vite.config.ts',
  'vite.config.cjs',
  'vite.config.mts',
  'vite.config.cts',
]

export const DEFAULT_EXTENSIONS = [
  '.mjs',
  '.js',
  '.mts',
  '.ts',
  '.jsx',
  '.tsx',
  '.json',
]

// Supported by Node, Deno, Bun
const NODE_BUILTIN_NAMESPACE = 'node:'
// Supported by Deno
const NPM_BUILTIN_NAMESPACE = 'npm:'
// Supported by Bun
const BUN_BUILTIN_NAMESPACE = 'bun:'
const nodeBuiltins = builtinModules.filter(id => !id.includes(':'))
export function isNodeBuiltin(id: string): boolean {
  if (id.startsWith(NODE_BUILTIN_NAMESPACE))
    return true
  return nodeBuiltins.includes(id)
}
export function isBuiltin(id: string): boolean {
  if (process.versions.deno && id.startsWith(NPM_BUILTIN_NAMESPACE))
    return true
  if (process.versions.bun && id.startsWith(BUN_BUILTIN_NAMESPACE))
    return true
  return isNodeBuiltin(id)
}

export function isFilePathESM(
  filePath: string,
  packageCache?: PackageCache,
): boolean {
  if (/\.m[jt]s$/.test(filePath)) {
    return true
  }
  else if (/\.c[jt]s$/.test(filePath)) {
    return false
  }
  else {
    // check package.json for type: "module"
    try {
      const pkg = findNearestPackageData(path.dirname(filePath), packageCache)
      return pkg?.data.type === 'module'
    }
    catch {
      return false
    }
  }
}

export function findNearestPackageData(
  basedir: string,
  packageCache?: PackageCache,
): PackageData | null {
  const originalBasedir = basedir
  while (basedir) {
    if (packageCache) {
      const cached = getFnpdCache(packageCache, basedir, originalBasedir)
      if (cached)
        return cached
    }

    const pkgPath = path.join(basedir, 'package.json')
    if (tryStatSync(pkgPath)?.isFile()) {
      try {
        const pkgData = loadPackageData(pkgPath)

        if (packageCache)
          setFnpdCache(packageCache, pkgData, basedir, originalBasedir)

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

export async function bundleConfigFile(
  fileName: string,
  isESM: boolean,
): Promise<{ code: string, dependencies: string[] }> {
  const dirnameVarName = '__vite_injected_original_dirname'
  const filenameVarName = '__vite_injected_original_filename'
  const importMetaUrlVarName = '__vite_injected_original_import_meta_url'
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    write: false,
    target: [`node${process.versions.node}`],
    platform: 'node',
    bundle: true,
    format: isESM ? 'esm' : 'cjs',
    mainFields: ['main'],
    sourcemap: 'inline',
    metafile: true,
    define: {
      '__dirname': dirnameVarName,
      '__filename': filenameVarName,
      'import.meta.url': importMetaUrlVarName,
      'import.meta.dirname': dirnameVarName,
      'import.meta.filename': filenameVarName,
    },
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          const packageCache = new Map()
          const resolveByViteResolver = (
            id: string,
            importer: string,
            isRequire: boolean,
          ) => {
            return tryNodeResolve(
              id,
              importer,
              {
                root: path.dirname(fileName),
                isBuild: true,
                isProduction: true,
                preferRelative: false,
                tryIndex: true,
                mainFields: [],
                conditions: [],
                overrideConditions: ['node'],
                dedupe: [],
                extensions: DEFAULT_EXTENSIONS,
                preserveSymlinks: false,
                packageCache,
                isRequire,
              },
              false,
            )?.id
          }

          // externalize bare imports
          build.onResolve(
            { filter: /^[^.].*/ },
            async ({ path: id, importer, kind }) => {
              if (
                kind === 'entry-point'
                || path.isAbsolute(id)
                || isNodeBuiltin(id)
              )
                return

              // With the `isNodeBuiltin` check above, this check captures if the builtin is a
              // non-node built-in, which esbuild doesn't know how to handle. In that case, we
              // externalize it so the non-node runtime handles it instead.
              if (isBuiltin(id))
                return { external: true }

              const isImport = isESM || kind === 'dynamic-import'
              let idFsPath: string | undefined
              try {
                idFsPath = resolveByViteResolver(id, importer, !isImport)
              }
              catch (e) {
                if (!isImport) {
                  let canResolveWithImport = false
                  try {
                    canResolveWithImport = !!resolveByViteResolver(
                      id,
                      importer,
                      false,
                    )
                  }
                  catch {}
                  if (canResolveWithImport) {
                    throw new Error(
                      `Failed to resolve ${JSON.stringify(
                        id,
                      )}. This package is ESM only but it was tried to load by \`require\`. See https://vitejs.dev/guide/troubleshooting.html#this-package-is-esm-only for more details.`,
                    )
                  }
                }
                throw e
              }
              if (idFsPath && isImport)
                idFsPath = pathToFileURL(idFsPath).href

              if (
                idFsPath
                && !isImport
                && isFilePathESM(idFsPath, packageCache)
              ) {
                throw new Error(
                  `${JSON.stringify(
                    id,
                  )} resolved to an ESM file. ESM file cannot be loaded by \`require\`. See https://vitejs.dev/guide/troubleshooting.html#this-package-is-esm-only for more details.`,
                )
              }
              return {
                path: idFsPath,
                external: true,
              }
            },
          )
        },
      },
      {
        name: 'inject-file-scope-variables',
        setup(build) {
          build.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
            const contents = await fsp.readFile(args.path, 'utf-8')
            const injectValues
              = `const ${dirnameVarName} = ${JSON.stringify(
                path.dirname(args.path),
              )};`
              + `const ${filenameVarName} = ${JSON.stringify(args.path)};`
              + `const ${importMetaUrlVarName} = ${JSON.stringify(
                pathToFileURL(args.path).href,
              )};`

            return {
              loader: args.path.endsWith('ts') ? 'ts' : 'js',
              contents: injectValues + contents,
            }
          })
        },
      },
    ],
  })
  const { text } = result.outputFiles[0]
  return {
    code: text,
    dependencies: result.metafile ? Object.keys(result.metafile.inputs) : [],
  }
}
