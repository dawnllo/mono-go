#!/usr/bin/env node
import { Command } from 'commander'
import log from './utils/log'
import excuteQueues from './process'

const dlc = new Command()

dlc
  .name(log.green('dlc'))
  .description('study build myself Cli Tool !')
  .version(log.green('1.0.0'), '-v, --version', 'version')
  .option('-h, --help', 'help information')

dlc
  .command('add <template> [rename]')
  .description('add template')
  .option('-f, --force', 'force overwrite file destination !!!')
  .action(excuteQueues)

dlc.parse()
