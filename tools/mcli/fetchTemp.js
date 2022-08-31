import download from 'download-git-repo' // 下载仓库模板工具


// 添加 组件模板（子命令）
const tempComps = {
  git: {
    url:"https://github.com/Dofw/Git-practice-exercise", // 仓库地址
    downloadUrl:"https://github.com:Dofw/Git-practice-exercise#master",// 下载地址
    description: 'common component template!'
  }
}

// download(downloadUrl,path, function(err) {
//   if (err) throw err;
//   console.log('下载成功!')

//   // 1.获取要改变的文件
//   // 2.使用向导方式，采集用户输入
//   // 3.使用模板引擎将输入数据解析到 package.json中
//   // 4.解析完毕，把解析后的结果重新写入 package.json中

//   inquirer.prompt([
//     {
//       type: "input",
//       name: "描述1",
//       message: "请输入描述1"
//     },
//     {
//       type: "input",
//       name: "描述2",
//       message: "请输入描述2"
//     },
//   ]).then((answers) => {
//     console.log(answers)
//     console.log(fs)
//     // const packagePath = `${path}/package.json`
//     // const packageContent = fs.readFileSync(packagePath, "utf8")
//     // const packageResult = handlebars.compile(packageContent)(answers)
//     // fs.writeFileSync(packagePath, packageResult)
//   })  
// });
