# 总结(新)

- 结合旧版笔记

## 1.editor、eslint、prettier概述介绍

### editor

vsCode有自己的默认格式配置。


### editor 和 eslint结合:

1.安装vsCode-eslint插件; 2. 修改vsCode配置文件, 将 默认格式 模式修改为 eslint 的模式。

```json
  "editor.formatOnSave": true, // 自动保存
  "editor.codeActionsOnSave": { // 改变格式模式
    "source.fixAll": true, // turns on Auto Fix for all providers including ESLint
    "source.fixAll.eslint": false // only turns it on for ESLint (有选择的禁掉eslit,开启其它)
  },

  // https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint#settings-options vscode官网 eslint插件setting options配置说明
  "eslint.useESLintClass": true,// 强制使用新的ESLint API。注意事项见官网。
  "eslint.enable": true, // 默认开启
  "eslint.format.enable": true, //启用ESLint作为验证文件的格式化器
  "eslint.validate": ["javascriptreact", "vue", "javascript", "html", "json"], // Defaults to ["javascript", "javascriptreact"].
```

2.eslint安装包与vscode插件的关系

- 关系是独立的
- vscode插件：vscode显示检查代码问题，有波浪线提示。
- 安装包：仅仅是提供给，命令行执行eslint的。如果没有vscode插件，那么就不会有波浪线；但可以格式化。

### editor 和 prettier结合:

1.安装vsCode-prettier插件; 2. 修改vsCode配置文件, 将 默认格式 模式修改为 prettier 的模式。

```json
  //设计同eslint
  //配置项见官网:https://prettier.io/docs/en/options.html
```

### eslint 和 prettier最佳实践

eslint 既是 格式化工具 又是 代码检查工具; 
prettier 仅仅是为 格式化 而生的工具

原因:

项目中使用了vscode的eslint和prettier插件，并开启了保存时自动格式化和自动修复代码的功能，在格式化风格上有冲突，导致闪烁bug

解决冲突:

eslint-config-prettier 关闭 ESLint 中与 Prettier 中会发生冲突的规则。github有说明。
eslint-plugin-prettier 将 Prettier 的规则设置到 ESLint 的规则中。
最后形成优先级：Prettier 配置规则 > ESLint 配置规则。

## 2.eslint核心属性功能介绍

配置文件优先级
eslint官网
plugin
extends
rules



