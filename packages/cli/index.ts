#!/usr/bin/env node
import { Command } from '@commander-js/extra-typings'
import addAction from './command/add/index'
import getListAction from './command/list/index'
import { initConfig } from './config'

// 初始化配置
const config = await initConfig()

const dlc = new Command()

dlc
  .name('dlc-cli')
  .description('study build myself Cli Tool !')
  .version('0.0.1')

dlc
  .command('add <template> [rename]')
  .description('add template')
  .option('-f, --force', 'force overwrite file destination !!!')
  .action(addAction)

dlc
  .command('list-remote')
  .description('view the remote template list')
  .action((...args) => { getListAction(config, args) })

dlc.parse()
