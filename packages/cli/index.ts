#!/usr/bin/env node
import { Command } from '@commander-js/extra-typings'
import chalk from 'chalk'
// import excuteQueues from './process/index'

const dlc = new Command()

dlc
  .name('dlc-cli')
  .description('study build myself Cli Tool !')
  .version('0.0.1')

dlc
  .command('add <template> [rename]')
  .description('add template')
  .option('-f, --force', 'force overwrite file destination !!!')
  // .action(excuteQueues)

dlc.parse()
