/** 
 * [link](https://zhuanlan.zhihu.com/p/44438844)
 * 
 * 1.webpack与grunt、gulp的不同？
 * 2.与webpack类似的工具还有哪些？谈谈你为什么最终选择（或放弃）使用webpack？
 * 3.有哪些常见的Loader？他们是解决什么问题的？
 * 4.有哪些常见的Plugin？他们是解决什么问题的？
 * 5.Loader和Plugin的不同？
 * 6.webpack的构建流程是什么?从读取配置到输出文件这个过程尽量说全
 * 7.是否写过Loader和Plugin？描述一下编写loader或plugin的思路？
 * 8.webpack的热更新是如何做到的？说明其原理？
 * 9.如何利用webpack来优化前端性能？（提高性能和体验）
 * 10.如何提高webpack的构建速度？
 * 11.怎么配置单页应用？怎么配置多页应用？
 * 12.npm打包时需要注意哪些？如何利用webpack来更好的构建？
 * 13.如何在vue项目中实现按需加载？
*/


// 1.
// 2.与webpack类似的工具还有哪些？谈谈你为什么最终选择（或放弃）使用webpack？
/** 
 * webpack 适合大型复杂项目打包
 * rollup 适合工具库打包 如react/vue
 * parcel 适合简单小项目 可以快速看到效果 打包速度快 由于调试信息少 因此不利于错误信息排查
*/

// 3.常见Loader
/** 
 * babelLoader 将es6转成es5
 * fileLoader 将文件输出到一个文件夹，在代码中通过相对路径找到
 * urlLoader 与fileLoader相似 在文件较小时 可将文件以base64注入代码中
 * sourceMapLoader 加载sourceMap文件  方便调试
 * imageLoader 加载并压缩图片
 * cssLoader 加载css 支持模块化 压缩 文件导入等
 * styleLoader 把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
 * eslintLoader 通过eslint对js代码进行检测
 * 
 * css-loader VS style-loader
 * [link](https://www.jianshu.com/p/cbd3375e2575)
 * [前提]样式打包的两种方式：
 * (1) 通过在head标签里动态增加style引入
 *     [1.]style-loader + css-loader
 *     [2.]js文件中引入样式文件 require('./main.css');
 *     [3.]webpack.config.js中增加 style-loader!css-loader
 * (2) 将css额外打包 在html中单独link这个文件
 *     extract-text-webpack-plugin插件用于抽离css样式 防止将样式打包在js文件中引起样式错乱
 *     webpack配置代码如下
 *     最后通过<link href='./dist/style.css' rel='stylesheet' type='text/css'>在html中引入
*/

constExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: './src/main.js',
       output: {
           path: path.resolve(__dirname, './dist'),
           publicPath: '/dist/',
           filename: 'build.js'
       },
       module: {
       rules: [{
            test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"        
                })
             }]
       },
       plugins: [newExtractTextPlugin("styles.css")]
}
/** 
 * css-loader 是将 css 装载到 javascript；style-loader 是让 javascript 认识css，require 时用
 * [css-loader](https://www.webpackjs.com/loaders/css-loader/)
 * 加载css文件 处理@import、url()等
 * [style-loader](https://www.webpackjs.com/loaders/style-loader/)
 * 将css样式通过style插入页面
*/


// 4. 常见plugin
/** 
 * define-plugin 定义环境变量
 * commons-chunk-plugin 提取公共代码
 * uglifyjs-webpack-plugin 通过uglify压缩代码
*/


// 5.Loader和Plugin的不同 [TODO:]
/** 
 * Loader 使webpack拥有加载和解析非JS的文件
 * Plugin 扩展webpack的功能，在webpack的生命周期，监听广播，通过webpack的API 改变输出结果
*/

// 6.webpack工作流程
/** 
 * 1. 初始化参数，将命令行参数与配置文件参数合并
 * 2. 用上一步参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法并开始执行编译
 * 3. 根据配置的entry确定入口文件
 * 4. 从入口文件触发，调用所有配置的loader对入口文件进行处理，再找出该文件的依赖，并递归对依赖文件进行loader处理，直到所有入口文件的依赖都处理完成
 * 5. 得到每个模块编译的结果并拿到模块依赖关系
 * 6. 根据入口和模块的依赖关系，组装成一个个包含多个模块的chunk文件，将chunk转换成单独的文件加入到输出列表
 * 7. 确定好输出内容后，根据配置确定输出路径和文件名，把文件内容写到文件系统
 * 
 * 以上阶段 webpack会在特定时间点广播特定事件 插件会在监听到感兴趣的事件时执行特定的逻辑 而且插件可以调用webpack提供的API修改webpack的输出内容
*/