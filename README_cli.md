# Cli 设计

## 库的选择

1. 命令行交互信息

- inquirer 大生态用的比较多, 依赖比较重。
- prompts 依赖比较少相对轻量。比较适合个人日常开发使用。(选择它)

2. 定义指令

- commander node.js 命令行解决方案。0 依赖, 也不错。
- cac 汪磊 up 个人喜欢使用,是 ts 写的。

3. 辅助

- chalk 字体样式
- ora 加载动效
- download-git-repo github 下载仓库工具
- handlebars 模板引擎
- node-fetch 在 node 环境中使用接近 web 标准的 fetch，看官网介绍。
- ini ini 格式的文件解析和序列化器 <https://github.com/npm/ini>。
- env-paths 获取存储数据、配置、缓存等的路径；使用正确的操作系统特定路径。大多数开发人员都错在这一点上。

## Node API

1. os
2. fs
3. path
4. crypto

## 设计模式

1. 中间件思想(汪磊 up)

```js
confirm; // 确认生成的路径是不是可用的路径，不是提示是否删除已存在等等操作。
parse; // 解析template，是否是本地路径还是请求仓库的资源。远程，此处下载资源。
load; // 根据解析src，加载资源生成流问题件集合。
inquire; // 根据配置文件，生成prompt配置，同时执行收集用户问题。
prepare; // 读取配置文件的过滤器，进行过滤等工作 fast-glob，rename
render; //
emit; // 写入
install; // 安装依赖，涉及启动新进程。进行安装，将提示信息在改命令行展示。
init; //
complete; // 完成todo

// 中间件上下文
const context = {
  template, //命令行信息
  project, //命令行信息
  options, //命令行信息

  // 用来
  src: "",
  dest: "",
  config: Object.create(null),
  answers: Object.create(null),
  files: [],
};
```

## 设计指令

add <template> [rename] 模板 重命名

- template(线上模式): 通过分支来管理模板，仅下载需要的。
  rule: temp/axios
  temp 代表仓库名；
  axios 代表仓库对应 axios 模板的分支。

- template(本地模式):
  rule: 待扩展

- cache 缓存

## 模板内容

1. vue3 初始项目(学 vue 脚手架)

2. tools 库

- 功能函数
- vue 组件
- vueComposibel
- echart
- axios
- api
- mock
- scss 自定义变量
- adapter 适配(设备大小)、响应式
- ...

3. formatter 相关

- eslint 配置
- prettier 配置
