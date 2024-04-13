#!/usr/bin/env node
import { Command } from 'commander'
import chalk from 'chalk'
import excuteQueues from './process'

const dlc = new Command()

dlc
  .name(chalk.green('dlc'))
  .description('study build myself Cli Tool !')
  .version(chalk.green('1.0.0'), '-v, --version', 'version')
  .option('-h, --help', 'help information')

dlc
  .command('add <template> [rename]')
  .description('add template')
  .option('-f, --force', 'force overwrite file destination !!!')
  .action(excuteQueues)

dlc.parse()
