- new
    ```js
        var a = new A()
    ```
    1. target = {}
    2. target.__proto__ = Fn.__proto__;
       target.__proto__.constructor = A;
    3. result = A.call(target, args);
    4. result && (typeof result === 'function' || typeof result === 'object') ? result : target
- this
    + 箭头函数this
        箭头函数当做普通函数调用时this指向调用他的对象，当做对象方法时this指向外层继承的执行上下文this
        ```js
        var obj = {
            age: 20,
            say: function() {
                console.log(this.age)
                var x = () => {
                    console.log(this.age)   //20
                }
            }
        }
        ```
    + 立即执行函数
        立即执行函数this指向全局
        > [link](https://www.jianshu.com/p/89c2aa2e9ebc)
- 六种继承模式
    1. 原型链继承
    2. 构造函数继承
    3. 组合继承（1+2）
    4. 原型式继承
    5. 寄生继承
    6. 寄生组合继承
- bind/call/apply
    + bind
    ```js
    Function.prototype.bind = function(context, ...args) {
        var self = this;
        return function(...arg) {
            // slice浅拷贝
            self.apply(context, Array.prototype.concat.call(args, Array.prototype.slice.call(arguments)));
        }
    }
    ```
    + apply
    ```js

    ```



- requestAnimationFrame
    动画的时间间隔太长，会导致卡顿不流畅；时间间隔太短，会导致事件频繁调用，浪费CPU等资源
    一般显示器的刷新频率是60hz，即1s刷新60次，平均每次时间为16.6ms，若使用定时器，由于定时器的误差，导致其效果不好
    requestAnimationFrame采用系统时间间隔，保证最佳绘制效率，提升性能，改善效果
    1. 把每一帧的DOM操作集中起来，在一次重绘或回流中完成，并且时间间隔跟随浏览器刷新频率
    2. 隐藏元素不重绘回流，节省CPU GPU 内存
    3. 页面不激活，动画暂停；激活后从上次暂停位置继续
- 变量提升
    ```js
        var tmp = 1;
        function f() {
            console.log(tmp);
            if (false) {
                var tmp = 2;
            }
        }
        f();        // undefined

        // 函数声明——全部提升
        console.log(foo);       // function() {}
        var foo = 'xxx';
        function foo() {}

        // 函数表达式——只有变量提升
        console.log(foo);       // undefined
        var foo = 'xxx';
        var foo = function() {}
    ```

- instanceOf 实现
    ```js
        function ifInstanceOf(obj, func) {
            var _prototype = func.prototype;
            var _proto_ = obj.__proto__;
            while(_proto_) {
                if(_proto_ === _prototype) return true;
                _proto_ = _proto_.__proto__;
            }
            return false;
        }
    ```
- sleep
    ```js
        function sleep(delay) {
            var startTime = Date.now();
            while(Date.now() - startTime < delay) {
                continue;
            }
        }
    ```

- 手写map/forEach

- async-await

- 观察者&&发布订阅模式

- 事件委托
    阻止事件冒泡：event.cancelBubble或event.stopPropagation

- 连等赋值
    [link](https://www.cnblogs.com/xxcanghai/p/4998076.html)
    ```js
        var a = {x: 1};
        var b = a;
        a = a.x = { x: 1 };
        console.log(a, b);
        // a: {x: 1}, b: {x: {x: 1}}
    ```

- 可迭代对象有哪些特点
- 翻转DOM
    https://icewind-blog.com/2014/10/20/reverse-dom-child-nodes/
