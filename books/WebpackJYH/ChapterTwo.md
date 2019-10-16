#### 模块打包

* 不同模块的标准及他们的区别
    + CommonJS 
        > 最开始只能在服务端使用,browserify出现后,它可以在nodeJS环境下将代码转换为浏览器可执行代码,因此客户端代码也可以遵循CommonJS规范

        - 导出
            > CommonJS也同样以单个文件做为自己的作用域,使用module.exports={}导出

        ```js
        // 每个文件顶部相当于隐藏了一段这样的代码
        var module = {
            exports: {}
        }
        // 为了方便,CommonJS还提供了简写形式,直接操作exports对象,这相当于:
        var module = {
            exports: {}
        }
        var exports = module.exports;
        ```
        **注意**

        1. 由于exports是一个引用,因此不可以直接给exports赋值
        ```js
        exports = {
            add: function() {}
        }
        // 这样只改了exports的指向,module.exports没有改变
        ```
        2. 尽量避免exports和module.exports混用,如下代码就会导致错误
        ```js
        exports.add = function() {}
        module.exports = {
            delete: function() {}
        }
        // 这样会把想要导出的add丢失
        ```
        - 导入
            > CommonJS导入使用require()

            ```js
            // Case01 要在外部使用导出API
            /* add.js */
            module.exports = {
                add: function(){}
            }
            var add = require('./add.js').add;
            // Case02 单纯为了执行该代码块
            /* run.js */
            console.log('this is run.js');
            require('./run.js');
            ```
            > 首次require一个模块会加载执行,后续再有导入操作不会执行,直接将执行结果的导出对象返回
                module.loaded字段用来标识该模块是否被加载过
            > require()可接受一个[路径]表达式

    + ES6 模块
        - ES6 Module会自动采用严格模式
        - 导出
            + 命名导出
            ```js
            // Method01
            export const name = '';
            // Method02
            const name = '';
            const age = '';
            export {
                name, age
            }
            ```
            + 默认导出
            ```js
            // 相当于导出一个名为default的变量
            export default {}
            ```
        - 导入
        ```js
        // Method01
        import {name, age[as myAge]} from './xx';
        // Method02
        import * as Info from './xx';
        // Info.name   Info.age
        ```
        **注意**

            当命名导入和默认导入混用时,要把默认导入写在前边

            ```js
            import React, {Component} from 'react';
            ```
        - 命名导出、导入可使用as关键字为变量重命名
        - 复合导入导出
            导入后立即导出[只支持命名导出的导入导出,默认导出只能分开写]
            ```js
            export {name ,age} from './xxx';
            
            import React from 'react';
            export default React;
            ```
+ CommonJS/ES6模块
    * 动态/静态
        - CJS的依赖关系是在运行时确定的,因此在代码执行之前,无法确定模块之间的依赖关系;
        - ES6的依赖关系是在编译阶段确定,就不支持路径变量,且必须放在作用域顶层;
        - ES6模块机制的优势
            1. 死代码检测和排除
            > 通过静态分析工具检测那些没有用过却被打包的代码,去掉这些“死代码”,减小打包体积
            2. 模块变量类型检查
            > JS属于动态类型语言,不会再代码执行前检查类型错误(eg:字符串类型的值进行函数调用).ES6Module的静态模块结构有助于确保模块之间传递的值或接口类型是正确的.[?TODO:]
            3. 编译器优化
            > CJS导入的是整个对象,ES6支持直接导入变量,减少层级,提高代码效率
    * **值拷贝/动态映射**
        - CJS中的导入导出是“值拷贝”,导出的是一份副本[快照],无法同步体现模块内部的变化,但是可以更改这份副本,不会同步到原始模块
        - ES6模块是“动态映射”,原始模块内部的变更会实时反映到导入的其他模块里,但是不能更改导入,会报错
    * 循环依赖
        - CJS
        ```js
        // foo.js
        var bar = require('./bar.js);
        console.log('this is :', bar);
        module.exports = 'this is foo.js';

        // bar.js
        var foo = require('./foo.js);
        console.log('this is :', foo);
        module.exports = 'this is bar.js';

        // index.js
        require('./foo.js');

        // 执行结果
        // this is :{}
        // this is : this is bar.js
        /**
         * index.js导入foo.js,foo.js第一行首先导入bar.js,进入bar.js执行,bar.js第一行又导入foo.js,这时不会再次进入foo执行,而是直接使用foo.js的导出结果,即为前面提到过的,模块初始时[index.js文件中require的执行结果]module.exports的值为{},继续执行bar.js到最后,导出为"this is bar.js",回到foo.js,这时的bar.js导入值为争取的"this is bar.js"
        ```
        > CJS中遇到循环依赖时,不会出错,但是也没办法按照预期正确导入模块
        > [原理解析]

        ```js
        /* require(xxx)执行如下代码,首次在index.js中执行require('foo.js')时,installedModules[moduleId]为undefined,会向下执行初始化代码,导出结果为{};
        在bar.js中再次执行到require('foo.js')时,判断条件为true,因此直接返回首次初始化的installedModules中的值 */
        // The require function
        function __webpack_require__(moduleId) {
            if(installedModules[moduleId]) {
                return installedModules[moduleId].exports;
            }
            // Create a new module (and put it into the cache)
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };
            ...
        }
        ```

        - ES6
        [TODO: 既然es6代码会转换成es5代码,最后import/export不还是会使用__webpack_require__么？]
        ```js
        // foo.js
        import bar from './bar.js';
        console.log('this is :', bar);
        export default 'this is foo.js';

        // bar.js
        import foo from './foo.js';
        console.log('this is :', foo);
        export default 'this is bar.js';

        // index.js
        import('./foo.js');

        // 执行结果
        // this is : undefined
        // this is : this is bar.js

        /**
         * 从index进入foo,执行import bar from './bar.js'进入bar,此时foo没有导出,因此在bar中导入的foo为undefined;bar继续执行完后回到foo,bar取到正确的返回值
        * /
        ```
        > ES6循环依赖与CJS不同之处在于,ES6不会导入初始值{},而是返回undefined
        > **[CJS->值拷贝/ES6->动态映射]**
        
            导出值为简单类型时,动态映射看起来没什么实际作用,如果导出为对象类型,最后在循环引用结束后的使用过程中,就可以取到争取的值
        
        ```js
        // index.js
        import foo from './foo';
        foo('index.js');

        // foo.js
        import bar from './bar';
        export default function foo(args) {
            console.log('here is foo.js');
            console.log('args is ', args);
            bar('foo.js');
        }

        // bar.js
        import foo from './foo';
        let flag = false;
        export default function bar(args) {
            if(flag) {
                return;
            }
            console.log('here is bar.js');
            console.log('args is ', args);
            foo('bar.js');
        }
        ```
* 其他类型模块
    - 非模块化文件,如script标签
        > script引入jquery等同于import './jquery.js',都会直接执行,一般这种库文件会显示将接口绑定在全局对象;但隐式声明一个var,在webpack中由于会视作一个js文件打包,有自己的顶层作用域,因此会有问题
    - AMD[Asynchronous Module Definition(异步模块定义)]

        ```js
            /**
             * 模块id/模块名称
             * 模块依赖
             * 模块返回值{函数: 返回函数的返回值; 对象: 返回该对象}
             */
            define('getSum', ['calculator'], function(match) {
                return function(a, b) {
                    console.log('sum:', + calculator.add(a, b));
                }
            });

            // 导入
            /**
             * 模块名
             * 加载后的回调
             */
            require(['getSum'], function(getSum) {
                getSum(2, 3);
            })
        ```
        > 好处是"异步","非阻塞性"的,执行到require语句时不会停下来加载require的模块,而是会继续执行后边的代码,使得模块加载操作不会阻塞浏览器
        > 理念很好,但是代码更冗长,不清晰且容易造成回调地狱,实际中用的很少
    - UMD[Universal Module Definition(通用模块标准))]
        ```js
            // calculator.js
            (function (global, main) {
                // 根据当前环境采取不同的导出方式
                if (typeof define === 'function' && define.amd) {
                    // AMD 
                    // 会首先判断当前环境有无define,如果需要,可更改判断的顺序
                    define(...);
                } else if (typeof exports === 'object') {
                    // CommonJS
                    module.exports = ...;
                } else {
                    // 非模块化环境
                    global.add = ...;
                }
            }(this, function () {
                // 定义模块主体
                return {...}
            }));
        ```
    - npm模块
        + npm/yarn使用方式不同,库通用
        + npm init -y 初始化项目,生成package.json文件
        + 使用
            * 只需要npm install 就会安装到node_modules文件并更新package.json文件;
            * 使用时import xxx from 'xxx';就会到node_modules文件夹查找;
            * 每个包文件有一个入口文件[维护在package.json的main字段]
                ```js
                // lodash
                // package.json
                {
                    "name": "lodash",
                    "main": "lodash.js"
                }
                // -> 对应的import文件为node_modules/lodash/lodash.js
                ```
            * 通过打包所需资源减小打包体积[<package_name>/<path>]
                ```js
                import all from 'lodash/fp/all.js';
                // webpack打包只会打包node_modules/lodash/fp/all.js,不会打包整个lodash库
                ```
* 模块打包原理


