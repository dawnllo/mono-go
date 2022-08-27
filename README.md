# SMonorepo
（monorepo）代码仓库设计

## file structure

1. tools 工具层

2. packages 应用层

<!-- 3. components 组件层 -->

## pnpm 命令

pnpm 使用 npm 的配置文件。

获取 config 中某个字段的值 使用 npm/pnpm config get 字段名:
  pnpm config get registry: 获取镜像地址
  pnpm config get userconfig: 获取使用的cinfig文件的路径。通过它可以了解都有哪些信息。

1. pnpm setup    #自动设置环境变量
2. pnpm config set global-bin-dir "D:\nodejs"   # pnpm全局bin路径
   pnpm config set store-dir "D:\.pnpm-store" # pnpm全局仓库路径(类似 .git 仓库)
   pnpm config set global-dir "D:\nodejs\pnpm\pnpm-global" # pnpm全局安装路径
   pnpm config set global-bin-dir "D:\nodejs" # pnpm全局bin路径
   pnpm config set state-dir "D:\nodejs\pnpm" # pnpm创建pnpm-state.json文件的目录
   pnpm config set cache-dir "D:\nodejs\pnpm\cache" # pnpm全局缓存路径


<!-- 脚本 -->
```json
  "scripts": {
    "preinstall": "npx only-allow pnpm", // 限制仅pnpm进行install
  }
```