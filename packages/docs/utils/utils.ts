import path from 'node:path'
import process from 'node:process'

export const isWindows
  = typeof process !== 'undefined' && process.platform === 'win32'
const windowsSlashRE = /\\/g
export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/')
}
export function normalizePath(id) {
  return path.posix.normalize(isWindows ? slash(id) : id)
}