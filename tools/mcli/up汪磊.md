## 汪磊 up

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
