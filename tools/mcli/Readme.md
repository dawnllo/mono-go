## 开源库选择

1. 命令行交互
   inquire: 大生态用的比较多, 依赖比较重。
   prompts: 依赖比较少相对轻量。比较适合个人日常开发使用。
   commander： 0 依赖, 也不错。

   汪磊 up，将功能设计为了 配置文件{ 基本配置、 钩子函数、等等}
   https://github.com/zce/caz/blob/renovate/commitlint-monorepo/docs/create-template.md

   npm init react / npm create react-app, 这两 npm 都兼容效果一样，在 npmjs.org 中安装的模块为 http://www.npmjs.org/package/create-react-app 这个包
   npm init @zce/nm, 加了命名空间。在 npmjs.org 中安装的模块为 http://www.npmjs.org/package/@zce/create-nm 这个包.(原因是生态 module 太多，名字重复，故加了前缀。)

.vscode

```json
{
  "files.associations": {
    // vscode将匹配到的文件.js.css等，按照html展示高亮效果。 右下角就会显示为html。
    "**/templ/**": "html"
  }
}

// @ts-check //以ts检查下面的类型。常用在文件的顶部，在js项目中指定某个js进行检查。基于vscode typescript插件。

// JSdoc
/** @type {import('module').xxx} */

// module.paths = module.parent.paths 将node module的查询提升到父目录。
```

2. 云函数平台https://vercel.com(汪磊)

- vercel、阿里云平台的使用，捣鼓捣鼓。例子：向云平台配置一个函数，配置不对外暴露的 keys, 对 githubApi 进行包装、处理, 返回需要的格式数据。https://caz.vercel.app/templates?owner=${owner}。

- cli 设计，中间件细想。

### chalk 美化字体颜色。

安装说明：chalk@5.0.0 使用的 es6module 的方式。在 commonjs 中不支持，原因没有 webpack 这样的工具。

1. 使用内置 color、bgColor

black 黑色
red 红色
green 绿色
yellow 黄色
blue 蓝色
magenta 品红
cyan 青色
white 白色
xxxBright

bgxxx
bgxxxBright

2. 使用 rgb 和 hex 自定义字体颜色，bgRgb 和 bgHex 自定义背景颜色

```
  console.log(chalk.rgb(9, 218, 158).bold('---- Hello Chalk 21 ----'))
```

### commanders 命令、参数定义

1. option 方法:
   定义参数选项
   自动生成 options 的 doc 文档，--help 所展示的。

   约定：

   - a short flag (single character) and a long name, separated by a comma or space or vertical bar ('|')

   - Multi-word options such as "--template-engine" are camel-cased, becoming program.opts().templateEngine etc.

   - use -- to indicate（指示、标识） the end of the options, and any remaining（剩余） arguments will be used without being interpreted（解释、解析）

   - An option and its option-argument can be separated by a space, or combined into the same argument. The option-argument can follow the short option directly or follow an = for a long option

   ```
     serve -p 80 serve -p80
     serve --port 80 serve --port=80
   ```

   - options tow types, boolean、 --expect <value>, undefined（unless Both not defined

   - Multiple boolean short options may be combined together, and may be followed by a single short option taking a value (最后一个 cheese)

   ```
     -d -s -p cheese  --> -ds -p cheese --> -dsp cheese
   ```

   - no- 使用是 false, 单独使用是 true, 如果首先定义 --foo， 那么在 --no-foo 不会改变默认值

   - --optional [value] 可选参数 改形式会识别成

   ```
     如果-5作为参数，要用=
     --id -5 会报错 找不到-5option
     需要使用这种方式--id=-5

     --id 不指定参数值，是id=true
   ```

   - Variadic 可变参数 ...

   ```
   .option('-n, --number <numbers...>', 'specify  numbers')
   $ collect -n 1 2 3 --letter a b c
   Options:  { number: [ '1', '2', '3' ], letter: [ 'a', 'b', 'c' ] }
   ```

   - Version 默认 flags are -V and --version

   ```
   program.version('0.0.1', '-v, --vers', 'output the current version');
   ```

   - --optional <value> 必填参数，使用了 option，就必须携带值。

   - 常用格式如下

   ```
     .option('-p, --pizza-type <type>', 'flavour of pizza', 'default');`
   ```

2. more configuration

- 有一些限制条件，不太常见的情况。

.addOption(new Option('-s, --secret').hideHelp()) 在 help 中隐藏功能。

- 自定义 option 的加工。

.option('-f, --float <number>', 'float argument', parseFloat)， parseFloat 函数接受两个参数，value、previous

3. Commands 子命令
