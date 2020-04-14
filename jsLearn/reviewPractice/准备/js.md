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
        ```js
        // 递归深拷贝
        function deepCopy(obj) {
            let newObj = {}
            for(let key in obj) {
                if(obj.hasOwnProperty(key)) {
                    if(obj[key] && typeof obj[key] !== 'object') {
                        newObj[key] = deepCopy(obj[key]);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
            return newObj;
        }
        // 没有方法的对象可以使用JSON.stringify实现深拷贝


        // hash 避免循环引用的深拷贝
        
        function deepClone(obj, map = new WeakMap()) {
            if(obj instanceof Date) return new Date(obj);
            if(obj instanceof RegExp) return new RegExp(obj);
            if(obj === null || typeof obj!== 'object') return obj; // 简单类型

            if(map.has(obj)) {
                return map.get(obj);
            }
            let res = {};
            map.set(obj, res);
            for(let key in obj) {
                if(obj.hasOwnProperty(key)) {
                    res[key] = deepClone(obj[key], map);
                }
            }
            return res;
        }

        let obj = {
            name: 1
        }
        obj.age = obj;
        console.log(deepClone(obj));
        ```

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
- 闭包
    + 有权访问另一个函数作用域中变量的函数
    + 可以记住并访问其他函数作用域时 产生闭包
    1. 可以访问函数定义时所在词法作用域
    2. 模拟块级作用域
    3. 私有化变量
    + 必须有外部函数，且外部函数必须执行一次 

- commonJS es6
    + commonJS:
        动态加载
        导入整个模块
        整个模块为一个对象
        使用的是值拷贝（即导入后，原始值得变化与之无关）
        模块引入后，会存储在内存中，再次require不会重复引入文件，会直接在内存中取该模块id对应的exports： { id: xxx, exports: {}, ... }
    + es6
        静态编译(相当于提升作用，优先于其他代码执行)--使得tree-shaking成为可能
        导入导出都是一个模块，所以可以有多个导出
        文件没有对象概念
        导入的是引用
- Promise.all / Promise.race / Promise.finally
    + Promise:
        * 保存异步事件执行结果，避免回调地狱
        * 缺点：
            1. 无法取消
            2. 无回调时失败状态外部无感知
            3. 无法得知pending中具体进度
    ```js
    Promise.all = function (promises) {
        return new Promise((resolve, reject) => {
            let result = [];
            if(!promises.length) {
                resolve([]);
            }
            for(let i = 0; i < promises.length; i ++) {
                Promise.resolve(promises[i]).then((data) => {
                    result.push(data);
                    if(i+1==promises.length) {
                        resolve(result);
                    }
                }).catch((err)=>{
                    reject(err);
                    return;
                })
            }
        })
    }
    Promise.race = function (promises) {
        return new Promise((resolve, reject) => {
            // 如果race是空数组 会一直pending
            if (promises.length === 0) {
                return;
            }
            for(let i = 0; i < promises.length; i ++) {
                Promise.resolve(promises[i]).then(data => {
                    resolve(data);
                    console.log('---',data);
                    return;
                }, err => {
                    reject(err)
                    return;
                })
            }
        })
    }
    Promise.race([
        Promise.resolve(33),
        Promise.resolve(2)]
    ).then(
        res=>{console.log('111',res)},
        err=>{console.log(err)}
    )
    ```
- 事件循环
[link](https://zhuanlan.zhihu.com/p/33058983)
```js
/** 
 * 作用域链的易遗漏知识点
*/
​(function() {

console.log(typeof foo); // function pointer
console.log(typeof bar); // undefined

var foo = 'hello',
bar = function() {
return 'world';
};

function foo() {
return 'hello';
}

}());​
// foo类型为function不是因为function定义在后，而是因为，
// [foo被声明了两次, 为什么foo展现出来的是functiton，而不是undefined或者string我们从创建阶段知道,尽管foo被声明了两次，函数在活动对象中是在变量之前被创建的，并且如果属性名在活动对象已经存在,我们会简单地绕过这个声明]

/** 
 * 浏览器环境下:
 * 执行栈和事件队列
 * [浏览器与Node的事件循环(Event Loop)有何区别?](https://juejin.im/post/5c337ae06fb9a049bc4cd218)
 * 
 * 浏览器常驻线程
 * 1.GUI渲染线程 负责页面渲染 html/css解析 构建dom树 页面布局等；重绘或者回流时调用该线程；与js引擎线程互斥，当执行js引擎线程，GUI会被挂起直到js执行完
 * 2.JS引擎线程 负责处理js脚本  执行代码;[包括异步回调或者定时器任务的执行]
 * 3.定时器触发线程 主线程执行代码遇到setTimeout等会将定时器交给该线程 计时结束后 事件触发线程将回调加入事件队列等待js引擎线程执行
 * 4.事件触发线程 将准备好的事件交给js引擎线程执行
 * 5.异步http请求线程 主要负责处理异步请求 promise ajax等 异步请求有结果后 事件触发线程将回调加入事件队列 等待js引擎线程执行
*/
// demo - 浏览器
Promise.resolve().then(()=>{
    console.log('Promise1') 
    setTimeout(()=>{
      console.log('setTimeout2')
    },0)
})
setTimeout(()=>{
    console.log('setTimeout1')
    Promise.resolve().then(()=>{
        console.log('Promise2')    
    })
},0)
/** 
 * 执行结果
 * Promise1
 * setTimeout1
 * Promise2
 * setTimeout2
 * 
 * 一开始执行栈的同步任务（这属于宏任务）执行完毕，会去查看是否有微任务队列，上题中存在(有且只有一个)，然后执行微任务队列中的所有任务输出Promise1，同时会生成一个宏任务 setTimeout2
 * 然后去查看宏任务队列，宏任务 setTimeout1 在 setTimeout2 之前，先执行宏任务 setTimeout1，输出 setTimeout1
 * 在执行宏任务setTimeout1时会生成微任务Promise2 ，放入微任务队列中，接着先去清空微任务队列中的所有任务，输出 Promise2
 * 清空完微任务队列中的所有任务后，就又会去宏任务队列取一个，这回执行的是 setTimeout2
*/

// demo-nodejs
console.log('start')
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)
Promise.resolve().then(function() {
  console.log('promise3')
})
console.log('end')
/** 
 * 执行结果
 * start
 * end
 * promise3 // *
 * timer1
 * timer2
 * promise1
 * promise2
 * 
 * 执行完同步任务后 先检测微任务 因此Promise3最先输出
*/

// demo03
console.log('script start')
async function async1() {
    await async2();
    // mi1
    console.log('async1 end');
    // ma3
    setTimeout(function() {
    	console.log('async1 setTimeout')
    }, 0);
}
async function async2() {
    console.log('async2 end');
    // ma1
    setTimeout(function() {
    	console.log('async2 setTimeout')
    }, 0);
}
async1();
setTimeout(function() {
    // ma2
    Promise.resolve().then(function() {
        // mi-again
    	console.log('setTimeout promise');
    })
	console.log('setTimeout');
}, 0);

new Promise(resolve => {
    console.log('Promise')
    resolve()
})
.then(function() {
    // mi2
	console.log('promise1')
})
.then(function() {
	console.log('promise2')
})

console.log('script end')


/** 
 * start
 * async2 end
 * promise
 * script end
 * async1 end
 * promise1
 * promise2
 * async2 setTimeout
 * setTimeout
 * setTimeout promise
 * async1 setTimeout
 * 
*/

/** 
 * Nodejs环境下:
 * [简书-深入理解nodejs event loop机制](https://www.jianshu.com/p/2b34a257108d)
 * [掘金](https://juejin.im/post/5af1413ef265da0b851cce80)
 * 1. timer 事件循环第一阶段，检测有无过期timer，如果有，将回调压入timer任务队列等待执行
 * 2. I/O回调 IO的回调，大部分是操作系统的回调
 * 3. 可忽略的一个prepare阶段
 * 4. poll (1)处理poll事件(2)已有超时timer，执行回调
 *    直到队列为空或达到nodejs执行上限
 * 接下来检测有无immediate：
 *  (1) 有，执行
 *  (2) 无，阻塞在此等待IO事件并会检测有无超时timer，如果有，开始下一轮事件循环，【检测timer的作用：否则就会一直循环在此处，无法执行定时任务】
 * 5. check setImmediate回调会被加入immediate队列
 * 6. close
 * 
 * 
 * 总结：
 * 事件循环的每个阶段都有一个执行队列
 * 在每个阶段都会执行完任务队列直到清空或者达到系统上限
 * 所有阶段顺序执行完后，称作事件循环完成一次tick
*/
// demo1
fs.readFile('a.js', () => {
    console.log('readFile');
    setTimeout(() => {
        console.log('timeout');
    }, 0);
    setImmediate(() => {
        console.log('immediate');
    });
})
/** 
 * nodejs执行结果
 * readFile
 * immediate
 * timeout
 * 
 * 对于以上代码来说，setTimeout 可能执行在前，也可能执行在后。
 * 首先 setTimeout(fn, 0) === setTimeout(fn, 4)，这是由源码决定的
 * 进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调
 * 如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了
*/
/** 
 * 对比nodejs环境与浏览器环境
 * 浏览器环境中的microtask在当次macrotask后执行
 * nodejs环境中microtask在每个执行阶段后执行
*/

// demo2
setTimeout(() => {
    console.log('timeout1');
    Promise.resolve().then(() => {
        console.log('promise1');
    })
}, 0);
setTimeout(() => {
    console.log('timeout2');
    Promise.resolve().then(() => {
        console.log('promise2');
    })
}, 0);
/** 
 * 浏览器执行结果
 * timeout1
 * promise1
 * timeout2
 * promise2
 * 
 * nodejs执行结果[由于promise的then回调放在microtask中，因此在执行完当次timer队列中的两个timeout后，才执行microtask]
 * ----- 1.node10及之前的版本
 * timeout1
 * timeout2
 * promise1
 * promise2
 * 
 * ----- 2.node11版本与浏览器执行结果一致
 * 只要已进入一个宏任务，就会立刻执行微任务队列 // *****
 * [node11 事件循环机制更改](https://juejin.im/post/5c3e8d90f265da614274218a)
*/

// setTimeout VS setImmediate
/** 
 * setImmediate 设计在poll阶段完成时执行，即check阶段；
 * setTimeout 设计在poll阶段为空闲时，且设定时间到达后执行，但它在timer阶段执行
*/


// process.nextTick() VS setImmediate()
/** i
 * promise.nextTick 优先级 >> setImmediate
 * nextTick一旦执行，就要等到队列清空，所以会造成IO饥饿
 * [官方推荐使用setImmediate]
*/
// demo3
const startTime = Date.now()
let endTime
fs.readFile('a.js', () => {
    console.log('finish time', endTime - startTime)
})
let index = 0
function handler() {
    if(index++ > 1000) return

    console.log('nextTick', index);
    Process.nextTick(handler);

    // console.log('setImmediate', index);
    // setImmediate(handler);
}

handler()

/** 
 * process.nextTick
 * nextTick 1
 * nextTick 2
 * ...
 * nextTick 1000
 * finish time
 * 
 * 
 * setImmediate
 * immediate 1
 * ...
 * finish time
 * ...
 * immediate 1000
*/


// demo4 process.nextTick VS promise.then
console.log('start')
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  });
  process.nextTick(()=>{
      console.log('nextTick');
  })
}, 0)
Promise.resolve().then(function() {
  console.log('promise3')
})
console.log('end')
/** 
 * 输出结果
 * start
 * end
 * promise3
 * timer1
 * promise1
 * timer2
 * nextTick
 * promise2
*/
```
- http缓存 强缓存、协商缓存
```js
/**
 * [link](https://www.cnblogs.com/wonyun/p/5524617.html)
 * [知乎](https://www.zhihu.com/question/20790576)
 * 浏览器在第一次进行资源请求时，根据服务器响应头中的相关信息，决定是否缓存及如何缓存
 * 1. 强缓存
 * 浏览器直接使用本地缓存，不向服务器发送请求，状态码200
 * 2. 协商缓存
 * 浏览器向服务器发送请求，询问本地资源是否可以继续使用，
 * 如果可用，服务器不返回资源，只返回响应头，
 * 如果不可用，则会返回新的资源，并在浏览器端根据新的响应头更新本地缓存信息
 * 
 * + 与强缓存相关的两个头信息：
 *  [如果以下两个字段同时存在，cache-control优先级更高]
 *  expires + cache-control
 * cache-control:[主要是用max-age字段计算当前时间是否缓存过期]
 *  (1) no-cache 不直接使用强缓存，而是向服务器发送请求询问
 *  (2) no-store 不允许浏览器缓存数据，每次请求直接向服务器发送
 *  (3) public 允许所有用户缓存，包括用户浏览器和其他中间代理服务器
 *  (4) private 只允许用户浏览器进行缓存
 * + 与协商缓存相关的头信息： 
 *  [如果以下两个同时存在，ETag优先级更高]
 * http 1.0 Last-Modified If-Modified--since
 * http 1.1 ETag If-None-Match
 * 
 * 二者流程类似，但是ETag方式如果服务器返回304，会在响应头返回ETag，即使没有任何修改
 * 
 * + 为什么有1.1缓存方式的出现：
 * (1) 一些文件也许会周期性的更改，但是他的内容并不改变(仅仅改变的修改时间)，这个时候我们并不希望客户端认为这个文件被修改了，而重新GET；
 * (2) 某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说1s内修改了N次)，If-Modified-Since能检查到的粒度是s级的，这种修改无法判断(或者说UNIX记录MTIME只能精确到秒)；
 * (3) 某些服务器不能精确的得到文件的最后修改时间
 * 
 * + 增加一个变量(如：时间戳)使得请求资源路径变化，从而摆脱强缓存的限制，加载新资源
 */
 ```

- module.exports exports export import
[link](https://www.cnblogs.com/fayin/p/6831071.html)
```js
/** 
 * CommonJS中以文件为一个模块，将module.exports作为该模块的外部接口，为了提供方便，Cjs还提供了exports，即
 * exports = module.exports，切忌将exports直接替换为其他对象，这样会丢失module.exports的引用关系
 * 
 * ES6使用export作为导出
 * export是对外接口，必须与模块内的变量一一对应
*/
```
- cacheFunction
    [link](https://www.cnblogs.com/rubylouvre/archive/2009/11/14/1603131.html)
    + 相关知识[惰性函数]
    [link](https://www.cnblogs.com/rubylouvre/archive/2009/10/30/1593094.html)



- 前端性能优化
    [link](https://www.jianshu.com/p/d9c20eafa67e)
    + 减少请求数 雪碧图
    + 网络传输gzip 移除注释代码
    + 减少使用style.script 外部资源可以有效缓存
    + 合理使用http缓存 cache-control expires  / Etag last-modified
    + 如果资源较多 可以资源分域 增加并行下载数
    + CDN加速
    + 减少@import样式 串行解析到这一行才会加载
    + 固定大小的图片位置可事先给定 减少重排
    + 优先加载首屏数据 其他资源可异步后续加载
    + hybrid离线资源缓存
    + 图片压缩上传
    + 图片过多可考虑懒加载
    + 尽量使用iconfont替代图片
    + 节流
    + 避免重排重绘
    + requestAnimationFrame
    + 服务端适度渲染
    + 如果可以，考虑使用http2.0 多路复用技术
- webpack性能优化
    [yuhao.ju](https://gitbook.cn/gitchat/column/59e065f64f7fbe555e479204/topic/59e96cbca35cf44e19f018c9)
    [webpack打包分析与性能优化](https://zhuanlan.zhihu.com/p/25212283)
    1. webpack如何打包，根据入口文件个数，单入口文件将他的依赖都打包到一个bundle中，多入口文件每个文件都执行单入口同样操作 不互相影响  即使同一个文件多次引用，也只会在打包文件中打包一次 CommonJS导出为值类型
    2. 定位打包速度慢原因
        webpack --profile --json > stats.json
        http://alexkuz.github.io/webpack-chart/
    3. 打包优化
        <!-- + 减小打包文件的体积 -->
        + commonsChunkPlugin
            * [commonsChunkPlugin](https://segmentfault.com/a/1190000012828879)
            * 要将webpack运行文件分离，否则每次hash都会变，无法起作用
            > 通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件
            ```js
            entry: {
                vendor: ['react', 'react-dom']
            }
            new webpack.optimize.CommonsChunkPlugin('vendor','common.js')
            ```
        + webpack.DefinePlugin
            > 创建一个编译时可以配置的全局常量 方便进行环境转换
        + 代码压缩
            UglifyJS代码压缩
        + webpack4 
            * 替换commonsChunkPlugin为optimization.splitChunks
            * 替换UglifyJS为optimization.minimizer=true
        + happyPack
        + 缓存与增量构建
            babel-loader?cacheDirectory 将构建过的文件缓存
            exclude: /node_modules/
        + DLL && DLLReference
            [dll过时？](https://juejin.im/post/5d8aac8fe51d4578477a6699)
            第三方NPM包不需要每次构建
        + resolve.alias 别名
            将用户请求重定向到另一个路径
            ```js
            resolve: {  // 显示指出依赖查找路径
                alias: {
                    comps: 'src/pages/components'
                }
            }
            ```
        + antd 使用babel-plugin-import按需加载
        + 服务端渲染，首屏优化，异步加载模块，按需加载，代码分割等

- sessionStorage localStorage indexDB
    **记着localStorage的变更有事件可以监听**
```js
/** 
 * [link](https://segmentfault.com/a/1190000018748168)
 * cookie静态资源隔离[cdn][将静态资源放在非主域名上，不携带cookie]
 * sessionStorage 与localStorage/cookie不同的一点是，即使是同源下的两个窗口，也不共享 [应用:刷新表单内容不丢失]
 * 同源下多个页面监听localStorage变更，可使用storage事件，同页面监听可以重写setItem方法，在这里触发一个自定义事件，再监听这个自定义事件
 * [indexDB使用](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)
*/
// IndexDB TODO:-indexDB??
var iDB = window.indexedDB.open('aName', 1);
iDB.onsuccess = ()=>{}
iDB.onerror = (e)=>{
    // e.currentTarget.error.message
}
iDB.onupgradeneeded = (e)=>{
    // e.target.result
}
// 增删改查[建议放到事务中进行]
```


- postmessage
```js
/** [link](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
 *  [知乎讲解](https://zhuanlan.zhihu.com/p/58654876)  [TODO:-webworker]
 * "结构化克隆算法"
 * 
 * [data: 使用结构化克隆算法使数据安全传送，所以不需要手动序列化]
 * [targetOrigin: 如果指定string类型，则必须协议+主机地址+端口号完全匹配才可以接受消息]
 * otherWindow.postmessage(message, targetOrigin, [transfer])
 * 
 * window.addEventListener('message', receiveEvent, false)
 * message: [data, origin, source]
 * (origin:调用postmessage时消息发送方的origin)
 * (source:发送消息窗口对象的引用，可以实现双向通信)
 */

// Mozilla 实例
/*
 * A窗口的域名是<http://example.com:8080>，以下是A窗口的script标签下的代码：
 */

var popup = window.open();

// 如果弹出框没有被阻止且加载完成

// 这行语句没有发送信息出去，即使假设当前页面没有改变location（因为targetOrigin设置不对）
popup.postMessage("The user is 'bob' and the password is 'secret'", "https://secure.example.net");

// 假设当前页面没有改变location，这条语句会成功添加message到发送队列中去（targetOrigin设置对了）
popup.postMessage("hello there!", "http://example.org");

function receiveMessage(event)
{
  // 我们能相信信息的发送者吗?  (也许这个发送者和我们最初打开的不是同一个页面).
  if (event.origin !== "http://example.org")
    return;

  // event.source 是我们通过window.open打开的弹出页面 popup
  // event.data 是 popup发送给当前页面的消息 "hi there yourself!  the secret response is: rheeeeet!"
}
window.addEventListener("message", receiveMessage, false);

// ————————————————

/*
 * 弹出页 popup 域名是<http://example.org>，以下是script标签中的代码:
 */

//当A页面postMessage被调用后，这个function被addEventListenner调用
function receiveMessage(event)
{
  // 我们能信任信息来源吗？
  if (event.origin !== "http://example.com:8080")
    return;

  // event.source 就当前弹出页的来源页面
  // event.data 是 "hello there!"

  // 假设你已经验证了所受到信息的origin (任何时候你都应该这样做), 一个很方便的方式就是把event.source
  // 作为回信的对象，并且把event.origin作为targetOrigin
  event.source.postMessage("hi there yourself!  the secret response " + "is: rheeeeet!", event.origin);
}

window.addEventListener("message", receiveMessage, false);


// 应用
/** TODO:-service/web worker
 * 1. 父子窗口iframe实现跨域通信[子窗口html域名与ajax请求域名相同，父子窗口通信，回传ajax返回内容]
 * 2. WebWorker [link](https://zhuanlan.zhihu.com/p/83001302)
 * 3. Services Worker [link](https://zhuanlan.zhihu.com/p/41652314)
 * [可以使用Service Worker来进行缓存,用js来拦截浏览器的http请求,并设置缓存的文件,从而创建离线web应用]
*/
// ***** 一个小的tip
// 要在子窗口onload后发消息 [link](https://www.zhihu.com/question/46816341)
```
- web worker
    为了解决js线程与UI渲染线程相互阻塞，将大计算量任务的代码交给web worker执行过
```js
var w = new Worker('./xxx.js');
// event: [data, source, origin:调用postMessage时消息发送方的origin]
w.onmessage = function(event) {
    console.log(event.data);
}

// xxx.js
var i=0;

function timedCount() {
    i=i+1;
    postMessage(i);
    setTimeout(timedCount,500);
}
timedCount();
```


- webpack工作流程及优化
    + [webpack工作流程](https://www.cnblogs.com/yxy99/p/5852987.html)
    + [webpack浅析与实现](https://www.jianshu.com/p/97acc9a5ab42)



- 柯里化
```js
function currying(fn, ...args) {
    return args.length < fn.length ?
        (...arguments) => currying(fn, ...args, ...arguments) : 
        fn(...args)
}
function sumFn(a, b, c) {
    return a + b + c
}
let sum = currying(sumFn);
sum(1)(2)(3)
sum(1)(2, 3)


/** 
 * [知乎-js函数柯里化](https://zhuanlan.zhihu.com/p/31271179)
 * 概念：值传递一部分参数给他，让他返回一个函数，去处理剩下的参数
 * [“将一个多参数函数转换为只接受一个参数的函数并返回接受剩余参数且可以返回正确结果的函数的过程“]
 * 偏函数：一个减少函数参数个数的过程
*/
// 偏函数
// 创建一个新函数，将部分参数替换为特定值
function multi(x, y) {
    return x*y;
}
// -->
var double = multi.bind(null, 2);
var x = double(3);  // 6
var y = double(4);  // 8
// 当一个较为通用的函数某个参数可以固定，且想要获取该函数的变体

// [张鑫旭-柯里化](https://www.zhangxinxu.com/wordpress/2013/02/js-currying/)
/**  柯里化的三个作用
 * 1.参数复用 [可以直接复用外层函数固定的参数]
 * 2.提前返回
 * 3.延迟计算
*/
// 2.--提前返回
// -- 柯里化之前
var addEvent = function(el, type, fn, capture) {
    if (window.addEventListener) {
        el.addEventListener(type, function(e) {
            fn.call(el, e);
        }, capture);
    } else if (window.attachEvent) {
        el.attachEvent("on" + type, function(e) {
            fn.call(el, e);
        });
    } 
};
// -- 柯里化之后
var addEvent = (function(){
    if (window.addEventListener) {
        return function(el, sType, fn, capture) {
            el.addEventListener(sType, function(e) {
                fn.call(el, e);
            }, (capture));
        };
    } else if (window.attachEvent) {
        return function(el, sType, fn, capture) {
            el.attachEvent("on" + sType, function(e) {
                fn.call(el, e);
            });
        };
    }
})();
// 3.--柯里化之前
var fishWeight = 0;
var addWeight = function(weight) {
    fishWeight += weight;
};

addWeight(2.3);
addWeight(6.5);
addWeight(1.2);
addWeight(2.5);

console.log(fishWeight);   // 12.5
// --柯里化之后
function curringAdd(fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        if(!arguments.length) {
            return fn.apply(null,args);
        } else {
            args = args.concat([].slice.call(arguments));
        }
    }
}
let num = 0;
var afterCurring = curringAdd(function() {
    for(let i = 0 ; i < arguments.length; i ++) {
        num += arguments[i];
    }
});
console.log(num);
```

- 节流防抖
    [link](https://github.com/ColaDaddyz/Blog/issues/8) TODO:
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


        function debounce(func, wait, immediate) {

            var timeout, result;

            return function () {
                var context = this;
                var args = arguments;

                if (timeout) clearTimeout(timeout);
                if (immediate) {
                    // 如果已经执行过，不再执行
                    var callNow = !timeout;
                    timeout = setTimeout(function(){
                        timeout = null;
                    }, wait)
                    if (callNow) result = func.apply(context, args)
                }
                else {
                    timeout = setTimeout(function(){
                        func.apply(context, args)
                    }, wait);
                }
                return result;
            }
        }
    ```
    + 节流throttle
    ```js
        function throttle(fn, delay) {
            let timer = null;
            return function() {
                if(!timer) {
                    fn.apply(this, Array.prototype.slice.call(arguments));
                    timer = setTimeout(() => {
                        timer = null;
                        clearTimeout(timer);
                    }, delay);
                }
            }
        }


        // 记住prev=0是作为本次不执行的前提
        // 增加参数的underscore实现
        _.throttle = function(func, wait, options) {
            var context, args, result;

            // setTimeout 的 handler
            var timeout = null;

            // 标记时间戳
            // 上一次执行回调的时间戳
            var previous = 0;

            // 如果没有传入 options 参数
            // 则将 options 参数置为空对象
            if (!options)
                options = {};

            var later = function() {
                // 如果 options.leading === false
                // 则每次触发回调后将 previous 置为 0
                // 否则置为当前时间戳
                previous = options.leading === false ? 0 : _.now();
                timeout = null;
                // console.log('B')
                result = func.apply(context, args);

                // 这里的 timeout 变量一定是 null 了吧
                // 是否没有必要进行判断？
                if (!timeout)
                context = args = null;
            };

            // 以滚轮事件为例（scroll）
            // 每次触发滚轮事件即执行这个返回的方法
            // _.throttle 方法返回的函数
            return function() {
                // 记录当前时间戳
                var now = _.now();

                // 第一次执行回调（此时 previous 为 0，之后 previous 值为上一次时间戳）
                // 并且如果程序设定第一个回调不是立即执行的（options.leading === false）
                // 则将 previous 值（表示上次执行的时间戳）设为 now 的时间戳（第一次触发时）
                // 表示刚执行过，这次就不用执行了
                if (!previous && options.leading === false)
                previous = now;

                // 距离下次触发 func 还需要等待的时间
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;

                // 要么是到了间隔时间了，随即触发方法（remaining <= 0）
                // 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
                // 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
                // 之后便会把 previous 值迅速置为 now
                // ========= //
                // remaining > wait，表示客户端系统时间被调整过
                // 则马上执行 func 函数
                // @see https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs
                // ========= //

                // console.log(remaining) 可以打印出来看看
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        // 解除引用，防止内存泄露
                        timeout = null;
                    }

                    // 重置前一次触发的时间戳
                    previous = now;

                    // 触发方法
                    // result 为该方法返回值
                    // console.log('A')
                    result = func.apply(context, args);

                    // 引用置为空，防止内存泄露
                    // 感觉这里的 timeout 肯定是 null 啊？这个 if 判断没必要吧？
                    if (!timeout)
                        context = args = null;
                } else if (!timeout && options.trailing !== false) { // 最后一次需要触发的情况
                    // 如果已经存在一个定时器，则不会进入该 if 分支
                    // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
                    // 间隔 remaining milliseconds 后触发 later 方法
                    timeout = setTimeout(later, remaining);
                }

                // 回调返回值
                return result;
            };
        };
    ```
- 可迭代对象
    + 只要一个对象有Symbol.iterator属性，就是可迭代的
    + Symbol.iterator返回一个可迭代对象
    ```js
    let arr = [1,2,3];
    let iter = arr[Symbol.iterator]();
    iter.next() {value: 1, done: false}
    iter.next() {value: 2, done: false}
    iter.next() {value: 3, done: false}
    iter.next() {value: undefined, done: true}
    ```
    + 原生具有Iterator接口的
        Array Map Set String arguments NodeList

- 观察者模式 && 发布订阅模式

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


