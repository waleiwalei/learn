# Chapter one
## 作用域
- [通常意义上的“词法作用域”]在声明阶段，即写代码时的位置决定的
```js
function foo() {
    var a = 1;
    return function() {
        // 这里是一个闭包
        console.log(a);
    }
}
var bar = foo();
bar(); //1
```
- 无论函数在哪里调用，如何调用，词法作用域只和函数声明时的位置有关
```
function foo(){console.log(a)}
function test(){
	var a = 2;
    foo();
}
test(); // ReferenceError a is not defined
```
- "遮蔽效应" 作用域外层同名变量会被内层遮蔽，无法访问
- 作用域“隐藏”[隐藏内部实现]
    - 可以实现“最小特权”
    - 避免同名变量导致冲突 [典型实例：全局命名冲突-多个库文件]
```
库文件通常都会在全局中声明一个名字足够独特的全局变量，通常是一个对象，这个对象被称作是这个库的命名空间，需要暴露的属性方法都会通过这个变量进行访问，而不是直接暴露到全局作用域中
```
- 立即执行函数IIFE
    - (function foo(){xxx})()括号使得这个函数不会被当做函数声明，而是被视为函数表达式
    - 变量名隐藏在自身中，避免非必要的污染外部作用域  foo只能被xxx内部访问到
    ```
    (function(global) {
        // something todo
    })(window);
    ```
    - UMD中常用的写法-将要执行的函数放在参数中,执行这个函数参数：
    ```
    (function (foo){
        foo(window)
    })(function(global) {
        // something todo
    });
    ```
- 块级作用域
    - 可以实现“最小特权”
    - 利于垃圾回收机制回收变量[事件回调形成的闭包时]
    - 避免同名变量导致冲突

    - try-catch 创建一个块级作用域
    - let 声明的变量不存在变量提升，会存在临时性死区
    - // TODO: 点击事件的this及this丢失
    - for-let块级作用域的基本原理
    ```
    {
        let i;
        for(i = 0; i < 5; i ++) {
            // 用每次迭代的i作为当前循环j的值
            let j = i;
            console.log(j);
        }
    }
    ```