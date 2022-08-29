#!/usr/bin/env node

import {Command} from 'commander'   // 定义指令
import inquirer from 'inquirer' // 采集用户输入

import download from 'download-git-repo' // 下载仓库模板工具
import chalk from 'chalk' // 字体颜色
import ora from 'ora' // loading动效
import handlebars from 'handlebars'// 模板引擎
// import fs from 'fs'

const program = new Command()

// 命令的描述
program
  .name(chalk.greenBright("mycli"))
  .description("study build myself Cli Tool !!!")
  .version("1.0.0", "-v, --version", "版本号")
  .option("-h, --help", "帮助选项")

// 添加 组件模板（子命令）
const tempComps = {
  git: {
    url:"https://github.com/Dofw/Git-practice-exercise", // 仓库地址
    downloadUrl:"https://github.com:Dofw/Git-practice-exercise#master",// 下载地址
    description: 'common component template!'
  }
}

program
  .command("add <conponent-name> [rename]")
  .description('add common component!')
  .option("-p, --pizza-type <type>", '测试option')
  .action((template, rename, options) => {
    console.log(template,rename,options)
    if (tempComps[template]) {
      const { downloadUrl } = tempComps[template]
      // 路径处理
      const path = rename  
      console.log(downloadUrl, path)
      download(downloadUrl,path, function(err) {
        if (err) throw err;
        console.log('下载成功!')

        // 1.获取要改变的文件
        // 2.使用向导方式，采集用户输入
        // 3.使用模板引擎将输入数据解析到 package.json中
        // 4.解析完毕，把解析后的结果重新写入 package.json中

        inquirer.prompt([
          {
            type: "input",
            name: "描述1",
            message: "请输入描述1"
          },
          {
            type: "input",
            name: "描述2",
            message: "请输入描述2"
          },
        ]).then((answers) => {
          console.log(answers)
          console.log(fs)
          // const packagePath = `${path}/package.json`
          // const packageContent = fs.readFileSync(packagePath, "utf8")
          // const packageResult = handlebars.compile(packageContent)(answers)
          // fs.writeFileSync(packagePath, packageResult)
        })  
      });
    }else{
      // throw '不存在的Template!'
    }
  })
  .on("--help", () => {
    console.log("输入指令后，跟上--help，提示子命令使用方式。")
  })

program.parse()
