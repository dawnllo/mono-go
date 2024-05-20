#!/usr/bin/env node
import process from 'node:process'
import { Command } from '@commander-js/extra-typings'
import addAction from './command/add/index'

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

dlc.parse(process.argv)
