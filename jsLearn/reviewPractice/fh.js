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
      16,webpack的工作流程
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


function quickSort(arr) {
    let left = 0;
    let right = arr.length - 1;
    function sort(i, j) {
        let index = i;
        let sortItem = arr[i];
        if(i > j) return;
        while (i != j) {
            while(i < j && arr[j] >= sortItem) {
                j--;
            }
            while(i < j && arr[i] <= sortItem) {
                i++;
            }
            if(i < j) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        let temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;

        sort(left, i - 1);
        sort(i + 1, right);
    }
    for(let i = 0; i < arr.length; i ++) {
        sort(left, right);
    }
}


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
 * for-in 遍历对象数组，遍历出属性名，但是会把数组自定义属性以及对象原型属性遍历出来啊（需要配合hasOwnProperty）
 * for-of 遍历对象，遍历出属性值
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


// ----- 13 函数珂里化
/** 
 * [知乎-js函数珂里化](https://zhuanlan.zhihu.com/p/31271179)
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

// [张鑫旭-珂里化](https://www.zhangxinxu.com/wordpress/2013/02/js-currying/)
/**  珂里化的三个作用
 * 1.参数复用 [可以直接复用外层函数固定的参数]
 * 2.提前返回
 * 3.延迟计算
*/
// 2.--提前返回
// -- 珂里化之前
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
// -- 珂里化之后
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
// 3.--珂里化之前
var fishWeight = 0;
var addWeight = function(weight) {
    fishWeight += weight;
};

addWeight(2.3);
addWeight(6.5);
addWeight(1.2);
addWeight(2.5);

console.log(fishWeight);   // 12.5
// --珂里化之后
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