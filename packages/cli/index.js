#!/usr/bin/env node
// import { name, version } from './package.json' assert { type: 'json' } // Node.js v17.1.0+ 后支持
import { Command } from 'commander' // 定义指令
import chalk from 'chalk' // 字体颜色
import excuteQueues from './process/index.js'
// import inquirer from 'inquirer' // 采集用户输入
// import ora from 'ora' // loading动效
// import handlebars from 'handlebars'// 模板引擎
// import fs from 'fs'

const mcli = new Command()

// 命令的描述
mcli
  .name(chalk.green('mcli'))
  .description('study build myself Cli Tool !')
  .version(chalk.green('1.0.0'), '-v, --version', 'version')
  .option('-h, --help', 'help information')

mcli
  .command('add <template> [rename]')
  .description('add template')
  .option('-f, --force', 'force overwrite file destination !!!')
  .action(excuteQueues)

mcli.parse()
