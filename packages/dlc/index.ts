#!/usr/bin/env node
// import { Command } from '@commander-js/extra-typings'
// import addAction from './command/add/index'
// import getListAction from './command/list/index'
import { initConfig } from './common/config'
import type { UserConfig } from '@/types'

export function defineConfig(config: UserConfig): UserConfig {
  return config
}

// 初始化配置
(async () => {
  await initConfig()

  // const gitConfig = config.git

  // const dlc = new Command()

  // dlc
  //   .name('dlc-cli')
  //   .description('study build myself Cli Tool !')
  //   .version('0.0.1')

  // dlc
  //   .command('add')
  //   .argument('<path>', 'file or directory path of template repository.')
  //   .argument('[branch]', 'branch to use', gitConfig.defaultBranch)
  //   .description('add template')
  //   .action((...args) => { addAction(config, args) })

  // dlc
  //   .command('list-remote')
  //   .argument('[path]', 'path to use', '')
  //   .argument('[branch]', 'branch to use', gitConfig.defaultBranch)
  //   .option('-l, --level <num>', 'level layer of catalog ', '3')
  //   .description('view the remote template list')
  //   .action((...args) => { getListAction(config, args) })

  // dlc.parse()
})()
