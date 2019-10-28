## Webpack构建优化, 让速度飞起来

## 使用到的 webpack 插件
 - friendly-errors-webpack-plugin
  Friendly-errors-webpack-plugin识别某些类别的webpack错误，并清理，聚合和优先级，以提供更好的开发人员体验。

- webpack-bundle-analyzer
使用交互式可缩放树映射可视化Webpack输出文件的大小

- speed-measure-webpack-plugin
了解您的插件和加载器的速度（或不快），以便优化构建

- hard-source-webpack-plugin
为模块提供中间缓存步骤, 第一次构建将花费正常的时间。第二次构建将显着加快。

- html-webpack-externals-plugin
  与html-webpack-plugin一起使用的Webpack插件，用于预先打包的供应商捆绑包。
## 开发环境

## 生产环境
 - 构建速度
    - 体积分析, 可视化
    - 缩小构建目标
    - 利用缓存, 提升二次构建速度
      - babel-loader 缓存
      - terser-webpack-plugin 开启缓存
      - 
    - tree-shaking
    - 压缩css、js、htm
    - 速度分析
    - 高版本的Node和 webpack
    - 多进程多实例构建(解析loader, 并行压缩)
    - 分包、预编译资源模块
    - 图片的优化
    - ur-loader, 将小于某些字节的图片转换为 base64格式的, 减少 https请求


babel-loader 缓存
  默认不开启, 缓存目录, 下次构建解析的时, 可直接从 缓存中读取, 缓存目录 node_modules/.cache/

terser-webpack-plugin 压缩缓存
  启用文件高速缓存。默认路径缓存目录：node_modules / .cache /更简洁-的WebPack的插件。

  string
  启用文件缓存，并设置路径缓存目录。

  hard-source-webpack-plugin
    提供模块中间缓存步骤的插件, 第一次速度正常, 第二次速度明显加快
