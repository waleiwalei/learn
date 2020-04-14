### sass
- 嵌套
- @mixin    复用样式模块 模块
- @extend   继承类样式
- @function
- &符号
- 计算功能
- 定义变量
### css @import的问题
- 需要加载并解析到第一个文件的@import时才去下载需要import的文件，影响页面渲染
- sass等预编译会最终打包为一个文件，解决上述问题 (extract-text-webpack-plugin 详见./webpackMore.md)
### css模块化
- 在webpack配置的css-loader后边增加?modules&localIdentName=[name]__[local]-[hash:base64:5]
    + 可选参数
        * [path]表示样式表相对于项目根目录所在的路径
        * [name] 表示样式表文件名称
        * [local] 表示样式表的类名定义名称
        * [hash:length] 表示32位的hash值
    + 只有类名选择器和ID选择器才会被模块化控制 HTML标签不会
```css
    .normal {
    color: green;
    }

    /* 以上与下面等价 */
    :local(.normal) {
    color: green; 
    }

    /* 定义全局样式 */
    :global(.btn) {
    color: red;
    }

    /* 定义多个全局样式 */
    :global {
    .link {
        color: green;
    }
    .box {
        color: yellow;
    }
    }
```
```js
import styles from './Button.css';

buttonElem.outerHTML = `<button class=${styles.normal}>Submit</button>`
```

### 移动端布局、适配

### flex常用属性