# 总结(新)

- 结合旧版笔记

## 1.editor、eslint、prettier 概述介绍

### editor

vsCode 有自己的默认格式配置。

### editor 和 eslint 结合:

1.安装 vsCode-eslint 插件; 2. 修改 vsCode 配置文件, 将 默认格式 模式修改为 eslint 的模式。

```json
  "editor.formatOnSave": true, // 自动保存
  "editor.codeActionsOnSave": { // 改变格式模式
    "source.fixAll": true, // turns on Auto Fix for all providers including ESLint
    "source.fixAll.eslint": false // only turns it on for ESLint (有选择的禁掉eslit,开启其它)
  },

  "eslint.useESLintClass": true,// 强制使用新的ESLint API。注意事项见官网。
  "eslint.enable": true, // 默认开启
  "eslint.format.enable": true, //启用ESLint作为验证文件的格式化器
  "eslint.validate": ["javascriptreact", "vue", "javascript", "html", "json"], // Defaults to ["javascript", "javascriptreact"].

  // https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint#settings-options vscode官网 eslint插件setting options配置说明

```

2.eslint 安装包与 vscode 插件的关系

- 关系是独立的
- vscode 插件：vscode 显示检查代码问题，有波浪线提示。
- 安装包：仅仅是提供给，命令行执行 eslint 的。如果没有 vscode 插件，那么就不会有波浪线；但可以格式化。

### editor 和 prettier 结合:

1.安装 vsCode-prettier 插件; 2. 修改 vsCode 配置文件, 将 默认格式 模式修改为 prettier 的模式。

```json
  //设计同eslint
  //配置项见官网:https://prettier.io/docs/en/options.html
```

### eslint 和 prettier 最佳实践

eslint 格式化工具、代码检查工具
prettier 仅为 格式化 而生的工具

原因:

项目中使用了 vscode 的 eslint 和 prettier 插件，并开启了保存时自动格式化和自动修复代码的功能，在格式化风格上有冲突，导致闪烁 bug

解决冲突:

eslint-config-prettier 关闭 ESLint 中与 Prettier 中会发生冲突的规则。github 有说明。
eslint-plugin-prettier (prettier 提供) 这个插件的主要作用就是将 prettier 作为 ESLint 的规则来使用，相当于代码不符合 Prettier 的标准时，会报一个 ESLint 错误，同时也可以通过 eslint --fix 来进行格式化。
最后形成优先级：Prettier 配置规则 > ESLint 配置规则。

官网说明:

Luckily it’s easy to turn off rules that conflict or are unnecessary with Prettier, by using these pre-made configs:

- eslint-config-prettier
- stylelint-config-prettier

First, we have plugins that let you run Prettier as if (像是) it was a linter rule:

- eslint-plugin-prettier
- stylelint-prettier

查看官网: https://prettier.io/docs/en/integrating-with-linters.html

## 2.eslint 核心属性功能介绍

配置文件优先级
plugin
extends
rules

eslint 官网:https://eslint.org/docs/latest/developer-guide/working-with-plugins
