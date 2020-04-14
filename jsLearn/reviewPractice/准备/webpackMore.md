### import的css文件从JS分离
- extract-text-webpack-plugin
    > 将js入口文件中的css文件单独打包，可以与js并行加载，可以缓存，且符合常规开发习惯
    ```js
    // webpack.config.js
    var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
    module.exports = {
        entry: '',
        output: {
            path: __dirname,
            filename: "./bundle/bundle.js"
        },
        module: {
            loaders: [
                {
                    text: /\.sass$/,
                    use: new ExtractTextWebpackPlugin("style-loader", "css-loader!sass-loader"),
                    exclude: "/node_modules/"
                }
            ]
        },
        plugin: [
            new ExtractTextWebpackPlugin('[name].css')
        ]
    }
    ```
### 模块
- 软件开发中，完成特定的功能的代码 封装为“模块”
    1. 作用域封装
    2. 代码解耦
    3. 按需加载
    4. 提高重用性

### AMD [异步模块定义]
- 显示表达模块依赖关系 且模块不在全局下
```js
    // 当前模块名称、依赖模块、导出（可以是函数或者对象）
    define('getSum', ['math'], function(math) {
        return function(a, b) {
            console.log('sum: ', math.sum(a, b));
        }
    })
```
### CommonJS
- 服务端标准
- 每个文件是一个模块，有自己独立的作用域和上下文
- 通过require导入依赖模块
- exports = module.exports暴露模块接口
- Browserify
    > 运行在node端的模块打包工具，能将模块按照node端模块规则合并为浏览器支持的形式，使得浏览器可以按照cjs标准编写和使用模块
**AMD和CommonJS都是显示引入依赖模块，解决模块引入顺序的问题**

### ES6模块
- 标准与CJS相似 通过export import导入导出
- es6也是一个文件一个模块，但是模块依赖关系是编译阶段确定的 import必须在顶层作用域 从而在静态分析阶段做优化【tc39动态import提案，webpack2.0开始支持了】
    + 例如CJS中可以通过if决定是否require
        ```js
            if(true) {
                require('xxx.js');
            }
        ```

### 模块打包原理
```js
// app.js
import moduleLog from './module.js';
document.write('app.js loaded.');
moduleLog();

// module.js
export default function() {
    document.write('module.js loaded.');
}

// webpack app.js dist/bundle.js 打包结果=>

// 01------------------------------------------------------------------
/*
 *modules 从入口文件开始找到的所有依赖模块数组
*/
(function(modules) {
    // 存放已经加载过的模块
    var installedModules = {};

    // webpack模块加载的核心
    function __webpack_require__(moduleId) {
        /* code */
    }
    // 使用__webpack_require__加载入口模块
    return __webpack_require__(0); // entry file
})([ /* modules array */ ]);


// 02------------------------------------------------------------------
/**
 * 1. 判断是否已经加载过moduleId,有则直接返回
 * 2. 新建一个module对象，增加【id,l标识是否加载过,exports导出】属性，并加入installedModules数组
 * 3. this指向module.exports并执行包装函数逻辑
 * 4. 将l字段置true并返回module.exports
*/
function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
    };
    // Execute the module function
    modules[moduleId].call(
        module.exports,
        module, module.exports,
        __webpack_require__
    );
    // Flag the module as loaded
    module.l = true;
    // Return the exports of the module
    return module.exports;
}

```
- 纵观整个过程，webpack所做的分别是
    1. 从入口文件开始分析模块依赖关系【依赖树】
    2. 将依赖模块包装后存入数组
    3. 实现__webpack_require__ 并把它提供到模块执行环境中 供循环调用
    4. 将执行入口文件的逻辑放入立即执行函数

- 支持es6模块的浏览器可以直接采用如下方式引入js文件 不使用webpack
    1. 无法向下兼容老版本浏览器
    2. 无法完成构建任务，如预编译，tree shaking等
    ```js
        <script type="module" src="app.js"></script>
        // main.js
        import {log} from "./module.js";
        log();
        // module.js
        export const log = function() {
            console.log('module.js loaded.');
        }
    ```
### npm
- npm config set registry 设置npm源镜像淘宝等
- -S npm时加入package.json的dependencies依赖中；-D加入devDependencies中
- npm install --only=prod/dev 只安装dependencies/devDependencies依赖
- 发布出去的包在被install时,只安装dependencies
- semver
    + ^1.X.X
    + ~1.1.X
    + 1.1.1
- npm shrinkwrap 根据当前node_modules生成npm-shrinkwrap.json版本锁定文件
    + 但是更新依赖文件时，不会手动同步锁定文件，需要再次执行npm shrinkwrap
    + npm4解决上述问题 安装更新删除依赖 会自动更新npm-shrinkwrap.json文件
    + npm5 package-lock.json(只能在顶层包中，不能在依赖包中)
    + npm生命周期 preinstall postinstall prepublish postpublish
    + 自定义命令 package.json 中配置script
        ```js
        {
            "scripts": {
                "dev": "webpack-dev-server",
                "build": "eslint ./src && webpack"
            }
        }
        ```
    + npm install 的安装过程 简略 (详细见下面 【npm安装流程的几个阶段】)
        1. 查找项目的锁定文件（npm-shrinkwrap.json/package-lock.json/yarn-lock.json）
        2. 根据锁定安装
        3. 如果没有锁定文件 直接根据package.json的semver规则安装并生成锁定；如果有锁定并且走完了步骤2 则直接查找锁定中没有，而在package.json中有的内容 并更新锁定文件
    + yarn why <packageName>
        * 根据log信息可以知道这个包是由哪个包依赖引入的
    
### webpack如何构建应用
- webpack强大的功能：
    + !!按需加载(code spliting)
    + 代码压缩
    + loader+plugin预编译处理
- 项目中安装webpack时 可执行文件位置为./node_modules/.bin/webpack
    ```js
    // ./node_modules/.bin/webpack app.js dist/bundle.js
    ```
- 配置文件demo
    ```js
    // webpack.config.js
    const path = require('path');

    module.exports = {
        entry: './app.js',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'bundle.js'
        }
    }
    ``` 
    + output 产物配置
        * path 路径 必须是绝对路径
        * filename 文件名
- webpack-dev-erver 
    + 本地开发使用 可以自动刷新浏览器
    + npm install webpack-dev-server --save-dev
    + 配置文件 
        ```js
            module.exports = {
                entry: './app.js',
                output: {
                    path: path.join(__dirname, 'dist'),
                    filename: 'bundle.js'
                },
                devServer: {
                    port: 3000, // 服务端口
                    publicPath: "/dist/" // 打包后资源路径，后面会详细解释
                }
            }
        ```
    + 执行 node_modules/.bin/webpack-dev-server 并访问localhost:3000
    **webpack-dev-server与执行webpack的区别**
    + 不会在项目中生成dist/bundle.js文件 只存在于内存中
- “一切皆模块” 
    > webpack依赖loader去解析那些不属于js的语法
    + css
        * css-loader 负责解析css
        * style-loader 
    + 配置文件
    ```js
    module.exports = {
        entry: '',
        output: {},
        module: {
            loaders: [{
                text: /\.css/,
                loader: 'style-loader!css-loader' // 执行顺序右向左
            }]
        }
    }
    ```
- 资源压缩 uglifyjs-webpack-plugin
    + 压缩过后bundle不可读，减小体积
    + 配置文件
    ```js
    var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
    module.exports = {
        entry: '',
        output: {},
        module: {},
        plugins: [
            new UglifyJSPlugin()
        ]
    }
    ``` 
- 按需加载
    + [lodash插件](https://www.cnblogs.com/binglove/p/11082146.html)
    + 如单页应用，可能需要加载很多资源，在需要时再引入即可
    + webpack支持异步加载（动态向页面中插入script）【比如，在跳转到对应路由时在进行资源的加载】
    + webpack支持的两种方式
        1. commonjs形式的require.ensure
        2. es6 import

        * 示例
            ```js
            // module.js
            export const log = function() {
                console.log('module.js loaded.');
            }
            // app.js
            import('./module.js').then(module => {
                module.log();
            }).catch(error => 'An error occurred while loading the module');

            document.write('app.js loaded.');
            ```
        * 配置文件
            ```js
            module.exports = {
                entry: '',
                output: {
                    path: path.join(__dirname, '/dist'),    // 输出到硬盘的路径，webpack-dev-server时用不到
                    publicPath: './dist/',  // 相对html文件的路径信息
                    filename: 'bundle.js'
                }
            }
            ```
        * 当项目中涉及按需加载及图片文件等外部资源时，需要配置publicPath TODO:
        * 打包产物会多出来0.bundle.js 按需加载插入script中 不是html引用的 而是由入口文件动态加载的

### webpack的构建特性
> 2.0开始更多优化特性
- tree-shaking
    + 编译阶段得到依赖树 检测那些模块中有不会被执行到的代码 称为死代码，webpack可以在打包过程中通过tree shaking去掉这些代码 减小包的体积
    + 只要模块遵循es6规范即可
    + 因此要注意
        **注意**
        * 如果在配置中使用了 babel-preset-es2015 或者 babel-preset-env，则需要将其模块依赖解析的特性关掉
        ```js
            presets: [
                env, {module: false}]
            ]
        ```
> 3.0新特性
- scope-hoisting 作用域提升
    + 模块依赖层级教深时，会产生较长的引用链，webpack将整个引用链拍平，使得模块与引用模块处于同级，减小打包体积，提升代码执行效率
    + 使用
    ```js
    module.exports = {
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin()
        ]
    }
    // 效果展示=> log的引用和定义在同一个作用域下了
    // CONCATENATED MODULE: ./module.js
    const log = function() {
        console.log('module.js loaded.');
    }

    // CONCATENATED MODULE: ./app.js
    log();
    ```
### 构建流程优化
#### npm安装过程的几个阶段
    1. 【分析包依赖和确定版本】根据package.json及semver规则，在这个过程中，会去npm仓库查看符合semver规则的最新版版本的包，然后通过递归关系获取更多包信息
    2. 【获取包的下载地址】在锁定文件中resolve字段，如果没有，会调用仓库接口，比如xxx@1.1.2 如果有，就返回压缩包地址，如果没有，404报错 install终止
    3. 【下载包（或使用缓存）】根据版本先查看是否有仓库+包名+版本完全相同的缓存，如果有，直接使用，如果没有，从仓库下载
    4. 压缩包解压，或者直接使用了缓存，copy到项目的node_modules中，这个过程中会涉及preinstall、postinstall等

1. 固化包信息
    + 在上边的过程中，递归分析包依赖是第一个很耗时的过程：项目本身的依赖就很多，而且基本上每个依赖又有自己的依赖，要把这些依赖逐层分析并拍平 十分耗时 【增加版本描述文件，平均可以缩短10s】

2. 仓库与镜像
    + 国内一般使用淘宝镜像 npm config set registry https://registry.npm.taobao.org
    + 有时只设置镜像还不够，可能在下载过程中涉及像postinstall这种生命周期，在生命周期中执行特定的脚本。比如node-sass需要下载二进制包来编译sass，这些文件也通常都在外网，也需要设置国内镜像 [此类文件Qunar镜像](https://ued.qunar.com/mirrors/)

3. 查找臃肿的依赖
    + [slow-deps](https://github.com/nolanlawson/slow-deps) 可以检测哪些东西影响了npm install的速度 
        * 可以看出包安装时间、包大小、自身依赖情况等
#### 打包流程分析与优化
- 将webpack打包理解为函数执行，输入是所有工程模块包括项目模块与node_modules，输出是js.css.html等静态资源，这个函数做了两件事：
    1. 依赖分析 从入口模块开始，逐层进行依赖分析，生成依赖树
    2. 文件编译 【非常耗时】依赖树中的文件需要根据配置决定将模块交给那些loader进行处理，比如Typescript文件需要经过ts-loader，sass要经过sass-loader,有些时候还需要链式loader进行处理
- 如何优化
    1. 减少不必要的编译 针对loader设置exclude 缩小loader的作用范围 避免不必要的工作
    ```js
    module.exports = {
        module: {
            noParse: [''],  // 整个webpack完全忽略，一般会是已经打包好处理好的单独的类库
            loaders: [{
                text: /\.ts$/,
                exclude: [/node_modules/], // 一般是node_modules 也可以只忽略一部分 用正则匹配
                exclude: /node_modules\/(?!(MY-MODULE|ANOTHER-ONE)\/).*/ 
                loader: ['ts-loader']
            }]
        }
    }
    ```
    2. 公共代码与CommonsChunkPlugin
        + 可以使用[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)打包分析，找出体积比较大的模块
        + CommonsChunkPlugin提取相同的模块 打包过程中，这个插件可以将多个入口文件中的公共模块提取出来单独处理，相当于减小了打包的体积
        + 抽取后，提升打包速度，减小资源体积，而且可以有效利用缓存
        + 配置示例
        ```js
        module.exports = {
            plugins: [
                new webpack.optimize.CommonsChunkPlugin({
                    name: "commons", //该代码块的名字
                    filename: "commons.js", // 指定输出代码的文件名
                    minChunks: 3, // 指定最小共享模块数 当超过minChunks个入口引用同一个模块才进行抽取，否则直接打包到对应入口
                    chunks: ["pageA", "pageB", "pageC"] // 作用于哪些入口
                })
            ]
        }
        ```
    3. 动态链接库思想 vendor 利用DLL
        > 相同的模块有可能会被多个入口引用，我们可以将这部分模块预先编译好，然后在项目打包的过程中直接去调用编译好的文件即可。这就是 Webpack 中 DllPlugin 的实现思路，当然它实际生成的还是 JS 文件而并不是真正的动态链接库，一般我们管它叫 vendor。
        1. 单独加webpack.vendor.config.js
        2. 打包动态链接库生成vendor npm run dll
        3. vendor链接到项目中 在webpack.config.js中配置
    4. 利用多进程 HappyPack(有效利用多进程编译文件的工具)
        + 核心思想：将同一个文件中多个没有依赖关系的模块交给不同进程编译处理后返回主进程 
        + 示例配置
        ```js
            const HappyPack = require('happypack');

            module.exports = {
                module: {
                    loaders: [
                    test: /\.js$/,
                    // 替换原来的 loader 为 "happypack/loader":
                    loaders: ['happypack/loader'],
                    ]
                },
                plugins: [
                    new HappyPack({
                    // 配置实际的 loader
                    loaders: ['babel-loader?presets[]=es2015']
                    })
                ];
            };
        ```
        + 压缩使用多进程 UglifyjsWebpackPlugin
        ```js
        const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

        module.exports = {
            plugins: [
                new UglifyJSPlugin({
                // 默认是 false，所以需要手动开启!!
                    parallel: true
                })
            ]
        }
        ```
- “28定律” 找到性能瓶颈 做到20%的改动优化80%的性能


### 参考
https://gitbook.cn/gitchat/column/59e065f64f7fbe555e479204/topic/59e96cbca35cf44e19f018c9




### 按需加载 异步加载 长效缓存