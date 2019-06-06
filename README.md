#### 搭建Vue开发环境 

- Vue移动端适配, 手淘解决方案 `amfe-flexible`, px2rem构建的时候将px转换成rem 

- 资源内嵌 ``row-loader@0.5.2` 
```html
    ${require('raw-loader!./src/assest/inline/meta.html')}
    <script>${require('raw-loader!babel-loader!./node_modules/amfe-flexible/index.js')}</script>
```