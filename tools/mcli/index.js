#!/usr/bin/env node

import {Command} from 'commander'   // 定义指令
import inquirer from 'inquirer' // 采集用户输入

import download from 'download-git-repo' // 下载仓库模板工具
import chalk from 'chalk' // 字体颜色
import ora from 'ora' // loading动效
import handlebars from 'handlebars'// 模板引擎
// import fs from 'fs'
import excuteQueues from './process/index'
const program = new Command()

// 命令的描述
program
  .name("mcli")
  .description("study build myself Cli Tool !")
  .version("1.0.0", "-v, --version", "version")
  .option("-h, --help", "help information")

program
  .command("add <template> [rename]") // 模板名 重命名
  .description('add template')
  .action(excuteQueues)
  .on("--help", (...arg) => {
    console.log(arg)
  })

program.parse()
