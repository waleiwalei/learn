/** 
 * 面试总结：
   手写代码：
      1，节流、去抖~
      2，Promise finally done 实现
      3，cacheFunction 实现  （一个函数调用，第二次调用的时候返回缓存结果）~
      4，快排
      5，promise.all 的实现
      6，深拷贝~
      7，数组去重~

   表述：
      8,事件循环机制
      9,setTimeout promise  process.nextTick 宏任务 微任务的考察，代码打印输出
      10,http缓存  协商缓存 强制缓存~
      11,for in for of map  forEach的区别~
      12,module.exports  exports  import export 区别~
      13,函数柯里化~
      14,rem解决方案~
      15,promise有几种状态？
      16,webpack的工作流程 [./webpack.js]
      17,postmessage通信~
      18,sessionStorage localStorage indexDB 区别和用法，记着localStorage的变更有事件可以监听~


   算法准备：
      leecode 简单类型的，刷个十几道
*/
//-----1 节流防抖
// 防抖
function debounce(fn, time) {
    var timer = null;
    return function() {
        if(!timer) {
            timer = setTimeout(fn, time);
        } else {
            clearTimeout(timer);
        }
    }
}
// throttle
function throttle(fn, time) {
    var preTime = new Date().getTime();
    return function() {
        var curTime = new Date().getTime();
        if(curTime - preTime >= time) {
            fn.apply(this, arguments);
            preTime = new Date().getTime.getTime();
        }
    }
}


// ------2


// ------3 cacheFunction
// https://www.cnblogs.com/rubylouvre/archive/2009/11/14/1603131.html
// 相关知识[惰性函数]
// https://www.cnblogs.com/rubylouvre/archive/2009/10/30/1593094.html

// ------4 快速排序

let a = [6, 1, 2, 5, 4, 7, 3, 9];
function qS(left, right) {
    let i, j, t, temp;
    if(left > right) return;
    temp = a[left];
    i = left;
    j = right;
    while (i != j) {
        while(a[j] >= temp && i < j) {
            j--;
        }
        while (a[i] <= temp && i < j) {
            i++;
        }
        if(i < j) {
            t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
    }
    a[left] = a[i];
    a[i] = temp;
    qS(left, i - 1);
    qS(i + 1, right);
}

let i, j, t;
let n = a.length - 1;
for(i = 0; i <= n; i ++) {
    qS(0, n);
}




// ----- 6.深拷贝
// ----- 6.1.递归深拷贝
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
// ----- 6.2 没有方法的对象可以使用JSON.stringify实现深拷贝

// ----- 7 数组去重
let arr = [1,2,1,4,5,3,2,1];
let arr1 = Array.from(new Set(arr));
function delRepeat(arr) {
    let obj = {};
    let newArr = [];
    arr.forEach((item) => {
        if(!obj[item]) {
            newArr.push(item);
            obj[item] == 1;
        }
    })
    return newArr;
}
// indexOf去重、双层循环去重等

// 8 事件循环
// [link](https://zhuanlan.zhihu.com/p/33058983)
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
    // micro1
    console.log('Promise1') 
    // macro2 
    setTimeout(()=>{
      console.log('setTimeout2')
    },0)
})
setTimeout(()=>{
    // macro1
    console.log('setTimeout1')
    // micro2
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






// ----- 10 http缓存 强缓存、协商缓存
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


// ----- 11 for-in for-of forEach map
/** 
 * for-in 遍历对象数组，遍历出属性名，
 *      但是会把数组自定义属性以及对象原型属性遍历出来（需要配合hasOwnProperty）
 * for-of 遍历数组，遍历出属性值
 * forEach 同for作用一致，而且没法中途退出循环
 * map 可以返回一个新数组，数组元素为每次循环的返回值
*/


// ----- 12 module.exports exports export import
// https://www.cnblogs.com/fayin/p/6831071.html
/** 
 * CommonJS中以文件为一个模块，将module.exports作为该模块的外部接口，为了提供方便，Cjs还提供了exports，即
 * exports = module.exports，切忌将exports直接替换为其他对象，这样会丢失module.exports的引用关系
 * 
 * ES6使用export作为导出
 * export是对外接口，必须与模块内的变量一一对应
*/


// ----- 13 函数柯里化
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


// ----- 14 rem
/** 
 * [link](https://www.jianshu.com/p/985d26b40199)
*/


// ----- 16 webpack的工作流程
/** 
 * [webpack工作流程](https://www.cnblogs.com/yxy99/p/5852987.html)
 * [webpack浅析与实现](https://www.jianshu.com/p/97acc9a5ab42)
*/

// ---- 17 postmessage
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

// 18 ----- sessionStorage localStorage indexDB
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



// 前端页面性能优化
// [link](https://www.jianshu.com/p/d9c20eafa67e)


// ----- Promise
/**
 * 保存异步事件执行结果，避免回调地狱
 * 缺点：
 * 1.无法取消
 * 2.无回调时失败状态外部无感知
 * 3.无法得知pending中具体进度
*/