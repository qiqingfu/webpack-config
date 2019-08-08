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

## Webpack 开箱即用的构建包环境 
> 此构建包不包含构建速度和构建体积优化, 可以从当前项目中拷贝 


[链接地址](https://github.com/qiqingfu/build-webpack) 


## 构建速度和体积分析 
```
"speed": "cross-env NODE_ENV=performance webpack --config webpack-prod.js"  

执行 npm run speed, 即可打包的同时分析速度和体积
``` 

## 构建速度优化 
- 使用高版本的 Webpack(4) 和高版本的 Node.js, 自带优化策略  

- 多进程多实例构建 
```javascript
{
    test: /\.js$/,
    use: [
        {
            loader: 'thread-loader',
            options: {
                workers: 3
            }
        },
        'babel-loader?cacheDirectory=true'
    ],
    exclude: file => (
        /node_modules/.test(file) &&
        !/\.vue\.js/.test(file)
    )
}
``` 
使用 `thread-loader` 

- js 并行压缩, 基于 terser-webpack-plugin插件 
在配置项中将 `parallel` 设置为 `true` 

- 分包、预编译 
1. 可以通过 `html-webpack-externals-plugin`插件, 来配置一些来自 `CDN` 的库, 减少library的体积。 
```javascript
// https://github.com/mmiller42/html-webpack-externals-plugin
new HtmlWebpackExternalsPlugin({
    externals: [
        {
            module: 'vue',
            entry: 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
            global: 'Vue'
        }
    ]
}),
``` 
2. 也可以使用分包预编译, `DLLPlugin`、`DLLReferencePlugin`来拆分 library。 文档地址`https://www.webpackjs.com/plugins/dll-plugin/`, 或参考目录下的 `webpack.dll.js`文件。 

- 充分利用缓存 
1. 分别可以配置 `babel-loader`的配置项 `cacheDirectory`设置为 true, 设置后，给定目录将用于缓存加载器的结果。

2. 配置 `terser-webpack-plugin`的配置选项, 将 `cache`设置为 true, 启用文件缓存。缓存目录的默认路径：node_modules / .cache / terser-webpack-plugin。 

3. 使用 `hard-source-webpack-plugin`插件, 模块提供中间缓存步骤。 
```javascript
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  context: // ...
  entry: // ...
  output: // ...
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}
``` 
- 缩小构建目标


