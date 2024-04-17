#!/usr/bin/env node
'use strict';

var commander = require('commander');
require('chalk');

// import excuteQueues  from './process/index'

const dlc = new commander.Command();

dlc
  .name('dlc-cli')
  .description('study build myself Cli Tool !');


// dlc
//   .command('add <template> [rename]')
//   .description('add template')
//   .option('-f, --force', 'force overwrite file destination !!!')
//   .action(excuteQueues)

dlc.parse();

console.log('dlc-cli');
