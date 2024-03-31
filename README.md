## 项目组织结构

```
mono-go
|-- docs
|-- packages
    |-- cli
    |-- v2-ui
    |-- v3-ui
|-- scripts
|-- readme.md

```

## 项目配置

1. 格式化配置, eslint [1]
   @antfu/eslint-define-config 提供一个 defineConfig 函数, 提供更好 ts 类型 🔔
   @antfu/eslint-config
2. ts 配置,
3. 打包配置, 使用 rollup / vite / webpack / parcel [2]
4. 测试配置
   单元测试: jest / vitest, 代码逻辑层的正确性 [3]
   集成测试/e2e 测试: cypress, 解决模拟用户在实际浏览器中的操作,进行全面测试.[end]
5. 代码提交配置, commitlint

##
