- new
    ```js
        var a = new A()
    ```
    1. target = {}
    2. target.__proto__ = A.prototype;
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

    + this几种情况
        1. new
        2. bind/call/apply
        3. 对象方法
        4. 默认window
- 深拷贝、浅拷贝
    + 常见浅拷贝： for...in Object.assign() ...运算符 Array.prototype.slice/concat
    + 深拷贝实现 JSON.stringify()+JON.parse 
        * 忽略函数、Symbol、undefined
        * 无法处理Date、RegExp
    + 手写深拷贝（hash）

- 六种继承模式
    1. 原型链继承 共享原型对象 无法传参
    ```js
        function Super(x) {
            this.x = x
        }
        let sup = new Super();
        function Sub() {
        }
        Sub.prototype = sup;
        Sub.prototype.constructor = Sub;

    ```
    2. 构造函数继承  不共享原型对象 可传参  但是超类方法无法调用
    ```js
        function Super(x) {
            this.x = x
        }
        function Sub(x, y) {
            Super.call(this, x);
            this.y = y
        }
    ```
    3. 组合继承（1+2） 要执行两次超类构造方法 
    ```js
        function Super() {}
        function Sub() {
            Super.call(this,xx);
        }
        Sub.prototype = new Super();
        Sub.prototype.constructor = Sub;
    ```
    4. 原型式继承 借助一个中间层function F
     效果差不多等同于Object.create(obj)
    ```js
    function createObj(obj) {
        function F(){}
        F.prototype = obj;
        let f = new F();
        /**
         *  target = {}
         *  target.prototype = F.prototype = obj
         *  target.prototype.constructor = F (obj.constructor = F)
         */
        return f;
    }
    ```
    5. 寄生继承  实例方法不复用 共享原型属性
    ```js
    function createObj(obj) {
        var newObj = Object.create(obj);
        newObj.xxx = function(){}
        return newObj
    }
    ```
    6. 寄生组合继承  只调用一次父类构造函数 保持原型链不变
    ```js
    function createObj(sup, sub) {
        var newObj = Object.create(sup.prototype);
        sub.prototype = newObj;
        sub.prototype.constructor = sub;
    }
    ```
- bind/call/apply
    + bind 【闭包】
    ```js
    Function.prototype.bind = function(context, ...args) {
        var self = this;
        return function(...arg) {
            // slice浅拷贝
            self.apply(context, Array.prototype.concat.call(args, Array.prototype.slice.call(arguments)));
        }
    }
    ```
    + apply(this, []) 内部调用func 【隐式绑定】
    + call(this, xx, xx)
    ```js
    Function.prototype.call(context, ...rest) {
    // Function.prototype.apply(context, rest) {
        if(!context) {
            context = typeof window === 'undefined' ? global : window;
        }
        context.fn = this; // 这样做是为了隐式绑定this为入参context
        if(rest) {
            return context.fn(...rest);
        } else {
            return context.fn();
        }
        delete context.fn;
    }
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
            // f内部的tmp会声明提升至f顶部 值为undefined
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
- 手写map/forEach
```js
// map参数列表 callback(item, index, array), this
Array.prototype.map  = function(callback, context) {
    let _this = this;
    if(!_this) {
        return;
    }
    let newArr = [];
    for(let i = 0; i < _this.length; i ++) {
        // forEach没有赋值操作 只执行回调
        newArr.push(callback.call(context, _this[i], i, _this));
    }
}
```
- async-await
    + async-await是Generator的语法糖，*改成async，yield改成await
    + 他在内部实现了next调用，不需要手动执行next方法 就能在await后边的异步操作有了结果后继续执行
    + 同样是异步写法同步化
    + 返回值是个promise

- instanceOf 实现
    ```js
    function isInstanceOf(l, rFunc) {
        let _proto = l.__proto__;
        let proto = rFunc.prototype;
        while(_proto) {
            if(proto == _proto) {
                return true;
            }
            _proto = _proto.__proto__;
        }
        return false;
    }

    let obj = {}
    obj.__proto__ = null;
    console.log(isInstanceOf(obj, Object));
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
- 柯里化

- (a==1)&&(a==2)&&(a==3) = true成立
    + 闭包维护一个自增的变量
```js
// 对象转数字，先调用valueOf 没有valueOf,调用toString
let a = {
    toString: (function(){
        let i = 1;
        return function() {
            return i++
        }
    })(),
    valueOf: (function(){
        let i = 20;
        return function() {
            return i++;
        }
    })()
}
console.log((a==1)&&(a==2)&&(a==3));

// 数据劫持
let a = new Proxy({}, {
    i: 1,
    get: function() {
        return this.i++
    }
})
console.log((a.i==1)&&(a.i==2)&&(a.i==3));
```
- 节流防抖
    + 防抖debounce
    ```js
        function debounce(fn, delay) {
            let timer = null;
            return function() {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn.apply(this, Array.prototype.slice.call(arguments));
                }, delay);
            }
        }
    ```
    + 节流throttle
    ```js
        function throttle(fn, delay) {
            let flag = true, first = true, last = true;
            return function() {
                first && fn.apply(this, Array.prototype.slice.call(arguments));
                first = false;  // 执行完第一次
                flag && fn.apply(this, Array.prototype.slice.call(arguments));
                setTimeout(() => {
                    flag = true;
                }, delay);
            }
        }
    ```



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
- 什么时候会发生强制类型转换
    + +运算
    + if(条件表达式)
    + String(number)
    + ==判等
    + !运算 || && 运算
- JS内置函数(注意：Math是对象 不是函数)
    + Date
    + Object Number String Function Boolean Array RegExp Error
- JSON
    + JS内置对象 一种数据格式
- 如何判断是数组类型 
    + instanceof [arr instanceof Array]
    + constructor [arr.constructor === Array]  或者 Array.prototype.isPrototypeOf(arr);
    + 注意：前两种方式必须在同一个页面中，如果是父子页面等，构造函数是两个不同的Array对象
    + Object.prototype.toString.call(arr) === "[object Array]" [link](https://blog.csdn.net/qzt1204/article/details/80468024)
- window.onload DOMContentLoaded
    + window.onload 页面资源都加载完毕
    + DOMContentLoaded DOM加载完毕

- requireJS简单实现
    https://zhuanlan.zhihu.com/p/24922957?from_voters_page=true
    https://blog.csdn.net/xutongbao/article/details/78189667


