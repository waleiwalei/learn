### webpack/rollup/parcel
- webpack 大型复杂前端站点
- rollup 基础库打包
- parcel 实验性项目 低门槛快速看到效果（调试信息有限，排查问题困难）
### 常见loader
- file-loader   把文件输出到文件夹 通过相对url去引用
    也可用于将css以link引入页面 代替css-loader的位置
- url-loader    与file-loader类似 但是可以在文件很小时通过base64注入代码中 limit
    + file-loader && url-loader
        * url-loader基于file-loader 当配置了limit 小于limit时，使用url-loader; 大于limit,使用file-loader
        * url-loader内部集成了file-loader 不需要单独安装
    + 常用配置项 
        [参数详解](https://blog.csdn.net/yezitoo/article/details/80177164)
        [配置](https://blog.csdn.net/qq_38652603/article/details/73835153)
        * name 打包后文件名 默认为hash + [ext扩展名]
        * publicPath 如果想放在cdn上，这里可以配置cdn的文件夹地址如http://www.cdn.com/imgs/
        * outputPath 图片打包后的文件夹名 （可以理解为加了个前缀）
    + demo 熟悉一下写法
        ```js
            module.exports = {
                entry: __dirname + '/src/main.js',
                output: {
                    // path: path.resolve(__dirname, 'dist'),
                    path: __dirname + '/dist',
                    filename: '[name].js'
                },
                module: {
                    rules: [
                        {
                            text: /\.sass$/,
                            use: ['style-loader', 'css-loader', 'sass-loader']
                        },
                        {
                            text: /\.png|jpe?g|gif$/,
                            use: [{
                                loader: 'url-loader',
                                options: {
                                    limit: '1024'
                                }
                            }]
                        },
                        // postcss TODO:
                        // demo
                        {
                            test: /xxx/,
                            use: {
                                loader: 'xxx-loader',
                                options: {
                                    cacheDirectory: false // 默认false true会缓存指定loader的执行结果
                                }
                            }
                        }
                    ]
                }
            }
        ```
```js
module.exports = {
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" }
    ]
  }
};
```
- source-map-loader
- image-loader
- babel-loader 把es6+的代码转义为浏览器可用的es5
- css-loader 加载 CSS，支持模块化、压缩、文件导入等特性
- style-loader 将样式通过添加style标签的形式导出到DOM
- sass-loader 加载和转义sass/scss文件
- postcss-loader 使用postcss加载和转义css/sss文件
- eslint-loader
### 常见plugin
- commons-chunk-plugin 提取公共代码
- uglifyjs-webpack-plugin 通过uglify压缩es6代码
### loader/plugin
+ 功能
    - loader 加载器 由于webpack只能解析js  其他格式文件需要loader 
    - plugin 做一些额外的工作 webpack运行周期会广播很多事件 不同plugin监听自己关注的周期完成额外的功能
+ 写法  
    - loader module.rules
    - plugin 单独配在plugins
### webpack热更新原理
### 性能优化
- 压缩代码
- CDN优化
- tree shaking
- 提取公共代码
### babel-core 
- babel核心 将js代码解析为AST
- 与babel-loader版本要求：
    babel-loader 8.x ->  babel-core 7.x
    babel-loader 7.x ->  babel-core 6.x
### babel-polyfill
[link](https://segmentfault.com/a/1190000010106158)
- babel-loader只能讲es6语法转换为es5，但是不会转换最新的API 因此 ：
    1. 直接使用babel-plugin-transform-object-assign 会直接进行多处代码替换
    2. 使用babel-plugin-transform-runtime && babel-runtime(线上环境)引入一个统一的core文件 但是由于不是全局生效的，只能对原型方法直接调用生效，如果是实例化对象，则还是无能为力
    3. babel-polyfill 全局生效 因此库项目里最好不用
### babel-plugin babel-preset
- babel-plugin [-transform-arrow-function、-transform-react-jsx] 针对某个具体新特性的plugin
- babel-preset [-es2015] 快速将某个版本的新特性都支持进来
- 执行顺序 先执行plugin再执行preset
- jsx语法： babel-preset-react || babel-plugin-transform-react-jsx
### babel-preset-env
- 默认情况跟babel-preset-latest 一样，会随着es标准的推出，越来越大
- target 指定需要支持的浏览器或node等环境 这样可以通过查询是否支持来只编译那些还不支持的（比如直接使用es201x会把当前浏览器已经支持的API也进行转换）
### .babelrc配置
[配置过程](https://blog.csdn.net/weixin_33739541/article/details/91438664?depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-4&utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-4)
```js
// 根据浏览器是否支持API引入不同插件，产生不同的编译结果
{
  // preset: 预设。在配置文件之中我们可以先添加我们需要的预设环境(preset是babel预设的一连串的plugins)
  "presets": [
    ["env", {
      "targets": {
        "node": "8.9.3",
        "browsers": [ "ie >= 8", "chrome >= 62" ],
        "esmodules" "",
        "module": "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false,
        "include": "",
        "exclude": "",
        // 这一属性确定preset-env如何处理polyfills
        "useBuiltIns": "usage" | "entry" | false
      }      
    }]
  ],
  // 用于设置编译后是否压缩
  "minified": "",
  // 布尔类型，表示打包编译之后不产生注释内容
  "comments": bool,
  // 设置对应环境下的配置？？
  "env": {
  // test 是提前设置的环境变量，如果没有设置BABEL_ENV则使用NODE_ENV，如果都没有设置默认就是development
     "test": {
       "presets": ["env", "stage-2"],
          // instanbul是一个用来测试转码后代码的工具
        "plugins": ["istanbul"]
    }
  }
}
```
### loader/plugin思路
### webpack构建流程
### webpack优化
[juejin](https://juejin.im/post/5d372851f265da1ba915bf78)
[webpack 性能优化](https://zhuanlan.zhihu.com/p/20914387)
[seg 打包优化解决方案](https://segmentfault.com/a/1190000011138081)
- 分析打包速度
- 分析影响打包速度的环节
- 优化解析时间
- 合理利用缓存
- 优化压缩时间
- 优化搜索时间



### 参考
    + [link](https://zhuanlan.zhihu.com/p/44438844)
    + [webpack工作流程](https://www.cnblogs.com/yxy99/p/5852987.html)
    + [webpack浅析与实现](https://www.jianshu.com/p/97acc9a5ab42)
    + [webpack原理](https://cloud.tencent.com/developer/article/1006353)
    + [webpakc优化](https://juejin.im/post/5d372851f265da1ba915bf78)