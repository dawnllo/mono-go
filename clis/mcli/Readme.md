## 开源库选择

1. 命令行交互
inquire: 大生态用的比较多, 依赖比较重。
prompts: 依赖比较少相对轻量。比较适合个人日常开发使用。
commander： 0依赖, 也不错。

2. 云函数平台https://vercel.com(汪磊)

- vercel、阿里云平台的使用，捣鼓捣鼓。例子：向云平台配置一个函数，配置不对外暴露的keys, 对githubApi进行包装、处理, 返回需要的格式数据。https://caz.vercel.app/templates?owner=${owner}。
- cli设计，中间件细想。


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

1. option方法:
    定义参数选项
    自动生成options的doc文档，--help所展示的。

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

    - Multiple boolean short options may be combined together, and may be followed by a single short option taking a value (最后一个cheese)

    ```
      -d -s -p cheese  --> -ds -p cheese --> -dsp cheese
    ```

    - no- 使用是false, 单独使用是true, 如果首先定义 --foo， 那么在 --no-foo 不会改变默认值

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
    - Version 默认flags are -V and --version
    
    ```
    program.version('0.0.1', '-v, --vers', 'output the current version');
    ```

    - --optional <value> 必填参数，使用了option，就必须携带值。

    - 常用格式如下

    ```
      .option('-p, --pizza-type <type>', 'flavour of pizza', 'default');`
    ```

2. more configuration

  - 有一些限制条件，不太常见的情况。

  .addOption(new Option('-s, --secret').hideHelp()) 在help中隐藏功能。

  - 自定义 option 的加工。

  .option('-f, --float <number>', 'float argument', parseFloat)， parseFloat函数接受两个参数，value、previous

3. Commands 子命令
  




# StackOverflow study

搜索技巧：the search term 搜索项、搜索词

1. 设置特殊的 tags 范围, 使用 [vue] xxx
  1.1 or operator, [tag1] or [tag2], 返回这两个的。

2. 在引号中，键入简练的短语  a specific phrase（短语），使用 "flat tire"
3. 将搜索项限制在 title上，使用 title：followed by the search term
4. 只在代码块中搜索，使用 code：xxxxx
5. 仅仅搜索自己的帖子，使用 user:me  xxx
6. 在标签、术语或则短语的结果中，做排除功能，使用 [tag] "xxx" -React
7. 在标签、术语或则短语的结果中，只包含关于这对喜剧情侣前半部分的，使用 [tag] "xxx" [laurel] -[hardy]
8. 使用通配符 * 扩大搜索结果。使用 test* te*st

高级搜索（advance search）

1. 范围操作 Range Operators
   1. score：score:-1` or `score:-1.. 表示 返回得分大于 或则 等于 -1 的
   2. views： views:500..1000` or `views:500-1000 表示 观点 在这个范围内的帖子
   3. answers: answers:..3 表示问题有3个或则更少的回答
2. 日期 Dates
   1. created
   2. lastactive
   3. 跟随参数
      1. only year : created:2012..2013, created:2012, 年区间或单独年（1月1日，12月31日）
      2. year and month :  created:2012-04..2012-05 
      3. year and month and day : lastactive:2012-04-03
      4. `1y`, `1m`, and `1d` are shorthand for "last year", "last month", and "yesterday" , 使用 created：1m
      5. 1y.. : lastactive:3m..   如果你想看到过去三个月里所有活跃的帖子，使用lastactive:3m..在4月15日，它将显示从1月15日到最近活跃的帖子。lastactive:3m..1m可以设置范围。
3.  用户 User Operators
   1. user:mine` or `user:me，搜索的是你的帖子
   2. inbookmarks:mine（or user id），搜索的是 id 已经添加的书签的问题
   3. initags:mine（or user id），搜索标记为收藏的标签中的帖子。
4. Boolean Operator, no 代表非。
   1. isaccepted: yes/true/1, 表示返回已标记为接受的答案。
   2. hascode: yes/true/1, 表示返回只包含代码快的帖子。
   3. hasaccepted: yes/true/1, 表示返回已经接受答案的问题。
   4. isanswered: yes/true/1, 表示只返回至少有一个正面答案的问题。
   5. closed: yes/true/1, 表示只返回已经关闭的问题。
   6. duplicate: Yes/true/1, 返回被标记为重复的问题;No /false/0从搜索中排除重复的问题。
   7. migrated: yes/true/1, 返回已经被迁移到不同站点的问题。
   8. locked: yes/true/1, 只返回锁定的帖子(有编辑、投票、评论和禁用的新答案);否/false/0只返回未锁定的帖子。
   9. hasnotice: yes/trur/1, 只返回带有如下通知的帖子。
   10. wiki: yes/ture/1, 只返回社区的wiki帖子。
​		
5. miscellaneous(复杂的, 其他的)
  1. url: 'example.com', 搜索包含url的帖子
  2. is: question, 返回的仅仅是问题
  3. is: answer, 返回的仅仅是答案
  4. inquestion:50691, 将搜索限制到id 50691的问题。
  5. inquestion:this, 这将结果限制在你已经查看的帖子上。

6. Collectives(集体、集合)
  1. collective: 'Name', 在集合“名称”中搜索帖子
  2. is:article 在集合中搜索文章