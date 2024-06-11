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
  .command('add')
  .argument('<template>', 'template to repository')
  .description('add template')
  .action((...args) => { addAction(config, args) })

dlc
  .command('list-remote')
  .argument('[path]', 'path to use', '')
  .argument('[branch]', 'branch to use', 'master')
  .description('view the remote template list')
  .action((...args) => { getListAction(config, args) })

dlc.parse()
