### eslint
- [link](https://juejin.im/post/58ff0de18d6d810058a69a26)
- 插件化静态代码检测工具 保持风格 减少错误
- 依赖
    + eslint 
    + eslint-loader
- 配置文件
    + .eslintrc
- webpack.config.js
    + 为需要进行代码检测的文件配置eslint-loader 一般在代码编译前进行检测
    ```js
    module: {
        rules: [
            // ...

            {
                test: /\.js[x]?$/,
                enforce: 'pre',
                use: [{
                    loader: 'eslint-loader',
                    options: { fix: true }
                }],
                include: path.resolve(__dirname, './src/**/*.js'),
                exclude: /node_modules/
            },

            // ...
        ]
    }
    ```
- package.json
    ```js
    // npm run lint
    "scripts": {
        "lint": "eslint --ext .js src"
    }
    ```
    ```js
    // husky 配置git hook脚本
    // 在安装 husky 的时候，husky会根据 package.json里的配置，在.git/hooks 目录生成所有的 hook 脚本
    <!-- "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    // lint-staged 对所有缓存区文件[pre-commit这个时期]执行以下配置的两条命令
    "lint-staged": {
        "*.js": [
            "eslint --fix-dry-run",
            "git add"
        ]
    } -->
    ```
- babel-eslint 检测es6代码
    + devDependencies 增加babel-eslint
    ```js
    {
        parser: "babel-eslint",
        "rules": {
            // 加入规则
        }
    }
    ```
- react 加入eslint 
    + devDependencies 增加eslint-plugin-react
    ```js
    {
        parser: "babel-eslint",
        "plugins": [
            "react"
        ],
        "rules": {
            "max-len": [1, 120, 2, {ignoreComments: true}],
            "prop-types": [2]
        }
    }
    ```
- .eslintrc 配置示例
    + [eslint配置](https://www.jianshu.com/p/bf0ffe8e615a)
```js
{
    //文件名 .eslintrc.json
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "commonjs": true
    },
    // globals 脚本在执行期间访问的额外的全局变量
    "globals": {
        "$": true,
        "jquery": true
    },
    // 一个配置文件可以被基础配置中的已启用的规则继承
    "extends": "eslint:recommended",
    "installedESLint": true,
    // 支持 ES6 语法并不意味着同时支持新的 ES6 全局变量或类型（比如 Set 等新类型）设置parserOptions支持
    "parserOptions": {
        "ecmaVersion": 6,   // 默认为5，也可设置3，7，或者年份
        // 额外的语法特性
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "arrowFunctions": true,
            "classes": true,
            "modules": true,
            "defaultParams": true
        },
        // sourceType 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
        "sourceType": "module"
    },
    // 解析器
    "parser": "babel-eslint",
    "plugins": [
        "react"
    ],
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        //"semi": ["error", "always"],
        "no-empty": 0,
        "comma-dangle": 0,
        "no-unused-vars": 0,
        "no-console": 0,
        "no-const-assign": 2,
        "no-dupe-class-members": 2,
        "no-duplicate-case": 2,
        "no-extra-parens": [2, "functions"],
        "no-self-compare": 2,
        "accessor-pairs": 2,
        "comma-spacing": [2, {
            "before": false,
            "after": true
        }],
        "constructor-super": 2,
        "new-cap": [2, {
            "newIsCap": true,
            "capIsNew": false
        }],
        "new-parens": 2,
        "no-array-constructor": 2,
        "no-class-assign": 2,
        "no-cond-assign": 2,
        "no-mixed-spaces-and-tabs": 0
    }
}
```
- pre-commit
    + devDependencies 增加pre-commit
    + package.json 增加命令
    ```js
    "pre-commit": [
        "lint"
    ]
    ```
- 规则
    + "off" 或 0 - 关闭规则
    + "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
    + "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
- 忽略代码检测配置
    + 在项目中新增.eslintignore文件
    + 或者：git commit --no-verify -m "commit"

### CSS MODULES
[什么是CSS Modules ？我们为什么需要他们](https://github.com/FrankKai/FrankKai.github.io/issues/45)

### git误删本地分支如何恢复
- git log -g 找到delete之前对应hash值X
- git recover newBranch X
### base64转png
### 懒加载、预加载
### 首屏渲染
### 离线包方案
- 现在web页面在移动端地位越来越高，大部分主流app采用native+webview的hybrid模式，加载远程页面受限于网络，本地webview引擎，经常会出现渲染慢导致的白屏现象，体验很差，于是离线包方案应运而生。动态下载的离线包可以使得我们不需要走完整的App审核发布流程就完成了版本的更新
### 自适应和响应式布局的区别
- 自适应布局通过检测视口分辨率，来判断当前访问的设备是：pc端、平板、手机，从而请求服务器，返回不同的页面；响应式布局通过检测视口分辨率，针对不同客户端在客户端做代码处理，来展现不同的布局和内容。
- 自适应布局需要开发多套界面，而响应式布局只需要开发一套界面就可以了。
- 自适应对页面做的屏幕适配是在一定范围：比如pc端一般要大于1024像素，手机要小于768像素。而响应式布局是一套页面全部适应。
- 自适应布局如果屏幕太小会发生内容过于拥挤。而响应式布局正是为了解决这个问题而衍生出的概念，它可以自动识别屏幕宽度并作出相应调整的网页设计

