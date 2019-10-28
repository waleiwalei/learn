[ts教程补充]
+ 基本类型
    - void 
        > void声明的变量可以用undefined/null赋值
    - undefined/null 
        > let a : undefined;
        > 是任意类型的子类型[let num : number = undefined/null;]
    - void 声明的变量不可以赋值给其他具体类型, undefined/null可以
    - "声明[只声明未赋值]"变量未指定类型,可以理解为声明的变量为any类型
    - 声明变量未指定类型直接赋值,会有类型判断,根据赋值类型给定类型判断,再改变为其他类型会报错
+ 接口interface
    - 确定属性  :
    - 可选属性  ?:
    - 任意属性  
    ```js
    interface Person {
        xxx: xxx;
        [propName: string] : any;
    }
    ```
    **注**
    > 一旦声明了任意属性,确定属性和可选属性都必须是任意属性类型的子集,否则报错
    ```js
        interface Pserson {
            name: string,
            age: number,
            [index: string]: number
        }
        // 上述声明,age为字符串索引,值类型为number,符合任意属性类型;
        // name为字符串索引,值类型为string,不符合任意属性的number值类型 -> err
    ```
    - 只读属性[只在创建”对象“时可以被赋值]
    ```js
    interface Person {
        readonly id : number
    }  
    let per : Person = {
        id: 123
    } 
    per.id = 234 // err
    ```

    - 类数组接口
        + IArguments
        ```js
            interface IArguments {
                [index: number]: any;
                length: number;
                callee: Function;
            }
        ```
+ 函数
    - 函数表达式
    [注意不要把ts中的=>与ES6搞混:] => 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型
    ```js
    let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
        return x + y;
    };
    ```

    - 接口定义函数形式
    ```js
    interface SearchFunc {
        (source: string, subString: string): boolean;
    }

    let mySearch: SearchFunc;
    mySearch = function(source: string, subString: string) {
        return source.search(subString) !== -1;
    }
    ```
    - 可选参数 ?: [必须放在必选参数后边]
    - 给了参数默认值的参数也会被认为是可选参数,但是这个参数不用遵循”必须放在必选参数“之后的规则
    - 剩余参数
    ```js
    function push(array: any[], ...items: any[]) {
        items.forEach(function(item) {
            array.push(item);
        });
    }
    ```
    - 重载
        * 按照声明顺序匹配,因此要把精确定义放在前边
+ 声明[declare xxx]
    -  声明文件: 对引入库文件的形式声明[只能声明,不能有具体实现]
        > 声明文件必须以.d.ts结尾
        > @types/xxx 统一管理第三方库的声明文件[devDependencies]
        (查找)[https://microsoft.github.io/TypeSearch/]
        > 声明文件引入方式
        * 全局变量 
            + <script src='jquery'> npm install @types/jquery 
            + 声明文件在项目中,最好放在src下或者对应源码目录 [不生效检查tsconfig.json中的files/include/exclude的xx.d.ts]
        * declare xxx
            + declare var/let/const
            + declare function[支持重载]
            + declare class
            + declare enum
            + declare namespace
        * namespace 被淘汰了，但是在声明文件中，declare namespace 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性(eg:jquery)
        * 嵌套的命名空间[用于在内层还有其他属性时,如果没有其他属性,可以直接在外层.一下]
        ```js
            declare namespace jquery.fn {
                function extend(object: any): void;
            }
        ```
        * 第三方库声明文件路径:
            1. npm包中package.json有@types/xx字段 或 文件夹下有index.d.ts
            2. 发布到@types[一般是发布npm包的开发者没有提供声明文件,由其他人补充的]
        * 自己动手写声明文件
            1. 在node_modules/@types/xxx/index.d.ts[不推荐,不安全]
            2. 在src同级下开types文件夹放/xxx/index.d.ts[需要配置tsconfig.json的paths/baseUrl字段]
            ```js
            {
                "compilerOptions": {
                    "module": "commonjs",
                    "baseUrl": "./",
                    "paths": {
                        "*": ["types/*"]
                    }
                }
            }
            // 如此配置之后，通过 import 导入 xxx 的时候，也会去 types 目录下寻找对应的模块的声明文件了。
            ```
    - export default只能到处function/class/interface,其他必须先declare
+ tsconfig.json
    - outDir: 输出目录
    - baseUrl: 基础目录
    - declaration true 自动生成声明文件 
    - declarationDir 生成目录
    - declarationMap 对.ts文件都声称map文件
    - emitDeclarationOnly 晋升成声明文件不生成js文件
+ 是否含有类型声明文件
    1. package.json types/typing: ''
    2. index.d.ts
    3. package.json-main: xxx.d.ts
+ something
    * @types/node 
        > nodejs不是内置对象一部分,在nodejs中使用ts需要引入第三方声明文件@types/node
    * @typescript-eslint/parser
        > eslint 使用Espree进行语法解析,无法识别一些ts语法,因此要使用@typescript-eslint/parser替代默认解析器
    * @typescript-eslint/eslint-plugin
        > 作为eslint规则的补充,提供一些适用ts的语法规则

+ eslint.js(json)
    
     
(书签)[https://ts.xcatliu.com/basics/declaration-files#shen-me-shi-sheng-ming-yu-ju]