import { builtinModules } from 'node:module'
import process from 'node:process'

// Supported by Node, Deno, Bun
const NODE_BUILTIN_NAMESPACE = 'node:'
// Supported by Deno
const NPM_BUILTIN_NAMESPACE = 'npm:'
// Supported by Bun
const BUN_BUILTIN_NAMESPACE = 'bun:'
const nodeBuiltins = builtinModules.filter(id => !id.includes(':'))

// node内置模块
export function isNodeBuiltin(id: string): boolean {
  if (id.startsWith(NODE_BUILTIN_NAMESPACE))
    return true
  return nodeBuiltins.includes(id)
}
// 支持的内置模块
export function isBuiltin(id: string): boolean {
  if (process.versions.deno && id.startsWith(NPM_BUILTIN_NAMESPACE))
    return true
  if (process.versions.bun && id.startsWith(BUN_BUILTIN_NAMESPACE))
    return true
  return isNodeBuiltin(id)
}
