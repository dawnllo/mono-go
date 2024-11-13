import { execSync } from 'node:child_process'
import process from 'node:process'
import cac from 'cac'

/**
 * 利用cac库解析命令行参数
 * result.args: 获取未匹配的命令行参数
 * result.options: 获取匹配的命令行参数
 * result.rawArgs: 获取原始命令行参数process.argv
 * result.options['--']: -- 是指cac中， -- 后面的不会被作为指令。
 * @param argv 
 * @returns 
 */
export function parseArgs(argv = process.argv) {
  const cli = cac('tools')
  const result = cli.parse(argv)
  const noMatchArgs = result.args // 获取未匹配的命令行参数
  const matchArgs = result.options

  return {
    '--': result.options['--'] || [],
    matchArgs,
    noMatchArgs,
  }
}

parseArgs()

// 配置bumpp, 哪些files需要更新版本号
execSync('bumpp --no-commit --no-tag --no-push', { stdio: 'inherit' })


// execSync('git add .', { stdio: 'inherit' })
// execSync(`git commit -m "chore: release v${version}"`, { stdio: 'inherit' })
// execSync(`git tag -a v${version} -m "v${version}"`, { stdio: 'inherit' })
