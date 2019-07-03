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


#### 资源分包
```javascript
// 抽离公用文件, minChunks引用的次数,超过2次的文件就抽离成公用的
splitChunks:{
    minSize: 0,
    cacheGroups: {
        commons: {
            name: 'commons',
            minChunks: 2,
            chunks: 'all'
        }
    }
}
```

#### 统计信息(stats)
在开发或生产环境中使用 `npm run dev` 或 `npm run build`时, 一些额外插件、包信息不是我们所关心的,只是想要获取某部分 bundle 的信息。可以借助 `friendly-errors-webpack-plugin`插件

```javascript
   // 开发环境
   devServer: {
       stats: 'errors-only'
   },
   plugins: [
        new FriendlyErrorsWebpackPlugin()
   ]

   // 构建
   stats: 'errors-only',
   plugins: [
       new FriendlyErrorsWebpackPlugin()
   ]
```
