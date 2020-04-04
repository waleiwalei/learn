### eslin
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