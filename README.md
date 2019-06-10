## 配置 Webpack 开发/生产环境

##### Vue移动端适配, 手淘解决方案 `amfe-flexible`, px2rem构建的时候将px转换成rem

- 资源内嵌 `row-loader@0.5.2`
```html
    ${require('raw-loader!./src/assest/inline/meta.html')}
    <script>${require('raw-loader!babel-loader!./node_modules/amfe-flexible/index.js')}</script>
```

##### 多页面自动化打包
page下面的所有文件夹中的文件都作为一个入口文件。
多页打包命令: `npm run build:pages`
打包文件到 `dist` 目录夹中


##### devtool
此选项控制是否生成，以及如何生成 source map。合理配置可以加速开发环境中的代码调试和错误定位
