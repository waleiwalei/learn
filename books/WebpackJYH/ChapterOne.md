#### 简介
- 何为webpack
    > webpack是一个模块打包工具,擅长处理模块之间的依赖关系,各个模块按照特定规则和顺序生成单个js文件
- 使用webpack的意义
    * 早期web项目引入js文件劣势:
        + 自己维护多个js文件的引入顺序,依赖关系复杂
        + http2之前 没有长连接,要建立多次js资源请求
        + 多个js文件都在顶层作用域,污染全局空间,容易引起命名冲突
    > 模块化思想: 按照功能划分,单独开发,测试,最终通过接口组合
    * 模块化优势:
        + 通过导入导出,依赖关系清晰
        + 将有依赖关系的模块生成单个js文件
        + 每个模块内部有自己的作用域
    * 模块打包工具:
        解决模块之间的依赖关系,生成浏览器可执行的代码
        + 两种工作模式:
            1. 将有依赖关系的模块打包为单个js文件,一起加载
            2. 在页面初始化时引入入口文件,其他模块异步加载
    * 使用webpack的原因:
        + webpack支持多种模块化方式:AMD、CommonJS、Es6
        + 有完善的代码分割实现方案
        + 支持多种文件格式,js/css/png/模板等 依赖Loader[参第四章TODO:]使用时只需要简单的导入即可
        + 庞大的社区、插件等完善
- 安装 
    只依赖node
- 开始一个项目
    * --entry 模块打包入口 webpack从这里开始查找依赖
    * webpack.config.js中output 的path参数必须是绝对路径[通过使用nodeJs的path.join]
    * __dirname: nodeJs内置全局变量,其值为当前文件所在的绝对路径
    * --save-dev 将依赖加入package.json的devDependencies中,只在本地开发中会用到,上线安装依赖可使用`npm install --production`过滤devDependencies中的冗余代码加快速度
    * webpack-dev-server
        > webpack-dev-server工作过程

            - 可以看做一个服务者,主要负责接收浏览器请求并返回资源文件;
            - 启动服务,webpack打包并准备好资源文件;
            - 接收到浏览器请求时,匹配请求url是否为下述配置的publicPath,匹配则从打包结果中返回对应资源
        > webpack-dev-server主要工作:

            1. 使用webpack对资源进行打包;
            2. 充当普通静态服务器,处理资源文件的请求

        **注意**
            webpack正常打包和使用webpack-dev-server进行打包的区别是:
            - webpack打包每次会在项目生成一个bundle.js文件;
            - webpack-dev-server只会在初始启动后将打包文件结果放入内存中,在收到请求后将内存中的打包结果返回给浏览器
        ----

        > 自动刷新(live-reloading)

            当webpack-dev-server检测到源文件更改,应该就会重新打包更新内存资源并刷新浏览器拿到最新的资源文件[后续还有hot-module-replacementTODO:]

        + package.json中额外增加如下配置
        ```js
        module.exports = {
            entry: './src/index.js',
            output: {
                filename: './bundle.js',    // 默认文件目录为./dist
            },
            mode: 'development',
            // 针对webpack-dev-server的配置项
            devServer: {
                publicPath: '/dist'
            }
        }
        ```
