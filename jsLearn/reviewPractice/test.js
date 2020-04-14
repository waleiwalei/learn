// // 原型式继承 
// function Sup() {}
// let sup = new Sup();
// function Sub() {}
// Sub.prototype = sup;
// Sub.prototype.constructor = Sub

// // 构造函数继承
// function Sup(x){this.x = x}
// function Sub(x, y){
//     Sup.call(this, x)
//     this.y = y
// }
// // 组合
// function Sup(x){this.x = x}
// function Sub(x, y){
//     Sup.call(this, x)
//     this.y = y
// }
// let sup = new Sup()


// // 原型式继承
// function objCreate(obj) {
//     function F(){}
//     F.prototype = obj;
//     F.prototype.constructor = F;
//     return new F();
// }

// // 寄生继承
// function createObj(obj) {
//     var newObj = Object.create(obj);
//     newObj.xxx = () => {}
//     return newObj;
// }

// // 寄生组合
// function changeProto(sup, sub) {
//     var obj = Object.create(sup.prototype);
//     obj.constructor = sub;
//     sub.prototype = obj;
// }




// // bind
// Function.prototype.bind = function (context, ...args) {
//     let _this = this;
//     return function (...arguments) {
//         _this.call(context, ...args, ...arguments);
//     }
// }

// // apply
// // Function.prototype.call = function (context, args) {
// // call
// Function.prototype.call = function (context, ...args) {
//     if(!context) {
//         context = typeof window === 'undefined' ? global : window;
//     }
//     let _this = this;
//     let res = {};
//     context.fn = _this;
//     res = context.fn(...args);
//     res = context.fn()
//     delete context.fn;
//     return res;
// }

// add(1)(2)(3)

// function add(...args) {
//     let allArgs = args;
//     function currying(...argus) {
//         allArgs = allArgs.concat(argus);
//         return currying;
//     }
//     currying.toString = function () {
//         return allArgs.reduce((prev, curr) => {
//             return prev + curr;
//         }, 0);
//     }
//     return currying;
// }
// console.log(add(1)(2)(3))

// function add(a, b, c) {
//     return a + b + c;
// }

// function currying(fn, ...args) {
//     return fn.length > args.length ?
//         (...argus) => currying(fn, ...args, ...argus) :
//         fn(...args, ...argus)
// }
// let foo = currying(add, 1);
// console.log(foo(2)(3));


// // throttle
// function _throttle(fn, wait, options) {
//     let {leading, trailing} = options || {};
//     let prev = 0, remain, timer = null, now, res, context, args;

//     function later() {
//         prev = !leading ? 0 : Date.now();
//         timer = null;
//         res = fn.apply(context, args);
//         context = args = null;
//     }

//     return function() {
//         context = this, args = arguments;

//         now = Date.now();
//         // 执行过 忽略这次的执行
//         if(!prev && !leading) {
//             prev = now;
//         }

//         remain = wait - (now - prev);
//         if(remain <= 0 || remain > wait) {
//             if(timer) {
//                 clearTimeout(timer);
//                 timer = null;
//             }

//             prev = Date.now();
//             res = fn.apply(context, args);
//             context = args = null;
//         } else if(!timer && trailing) {
//             timer = setTimeout(later, remain);
//         }

//         return res;
//     }

// }



// // Promise.all
// Promise.all = function(promises) {
//     return new Promise((resolve, reject) => {
//         if(!promises.length) resolve([]);
//         let res = [];
//         for(let i = 0; i < promises.length; i ++) {
//             Promise.resolve(promises[i]).then(data => {
//                 res.push(data);

//                 if(res.length == promises.length) {
//                     resolve(res);
//                     return;
//                 }
//             }, err => {
//                 reject(err);
//                 return;
//             });
//         }
//     })
// }

// // Promise.race
// Promise.race = function(promises) {
//     if(typeof promises[Symbol.iterator] !== 'function') {
//         return Promise.reject("args is not iteratable!");
//     }
//     return new Promise((resolve, reject) => {
//         if(!promises.length) return;
//         for(let i = 0; i < promises.length; i ++) {
//             Promise.resolve(promises[i]).then(data => {
//                 resolve(data);
//                 return;
//             }, err=>{
//                 reject(err);
//                 return;
//             })
//         }
//     })
// }
// // Promise.finally
// Promise.prototype.finally = function (callback) {
//     return this.then(
//       value  => Promise.resolve(callback()).then(() => value),
//       reason => Promise.resolve(callback()).then(() => { throw reason })
//     );
// }

// // Promise简单实现
// var p = new Promise((resolve, reject) => {
//     if(1) {
//         resolve();
//     } else {
//         reject();
//     }
// }).finally(() => {

// })

// function Promise(callback) {
//     this.status = 'pending';
//     this.data = {};

//     callback((data)=>{
//         this.status = 'fulfilled';
//         this.data = data;
//     },(err)=>{
//         this.status = 'rejected';
//         this.data = err;
//     })
// }

// Promise.then = function(resolve, reject) {
//     if(this.status == 'fulfilled') {
//         resolve(this.data);
//     }
//     if(this.status == 'rejected') {
//         reject(this.data);
//     }
// }

// // map实现
// Array.map = function(callback, context) {
//     let res = [];
//     let arr = this;
//     for(let i = i; i < arr.length; i ++) {
//         res.push(callback.call(context, arr[i], i, arr));
//     }
//     return res;
// }

// function _instanceOf(obj, func) {
//     let proto = func.prototype;
//     let __proto__ = obj.__proto__;
//     while(1) {
//         if(proto === __proto__) return true;
//         if(!__proto__) return false;
//         __proto__ = obj.__proto__;
//     }
// }

// 冒泡
// function sort(arr) {
//     for(let i = 0; i < arr.length; i ++) {
//         for(j = i; j < arr.length; j ++) {
//             if(arr[j] < arr[i]) {
//                 [arr[j], arr[i]] = [arr[i], arr[j]]
//             }
//         }
//     }
//     return arr;
// }
// let arr = [12,4,2,5,8];
// console.log(sort(arr));

// 快速排序
function quickSort(arr, left, right) {
    left = left || 0;
    right = right || arr.length - 1;
    let i = left, j = right;
    if(left>=right)return;
    while (i < j) {
        let cur = arr[i];
        while (i < j && arr[j] >= cur) {
            j--;
        }
        while (i < j && arr[i] <= cur) {
            i++;
        }

        if(i == j) {
            [arr[j], arr[left]] = [arr[left], arr[j]]
        }
        if(i < j) {
            [arr[j], arr[i]] = [arr[i], arr[j]]
        }
    }
    quickSort(arr, left, j - 1);
    quickSort(arr, j+1, right);
    return arr;
}

// 插入排序
function insert(arr) {
    for(let i = 1; i < arr.length; i ++) {
        let cur = arr[i];
        for(let j = i; j >= 0 && arr[j] > cur; j --) {
            arr[j+1] = arr[j];
        }
        arr[j] = cur;
    }
    return arr;
}

// 数组去重
function unique(arr) {
    // return Array.from(new Set(arr));
    // return [...(new Set(arr))];
    arr.reduce((prev, curr)=>{
        return prev.includes(curr) ? prev : [...prev, curr]
    }, []);
}

// 数组扁平化
function changeArr(arr) {
    let arr = [];
    // return arr.flat(Math.pow(2, 53) - 1)
    for(let i = 0; i < arr.length; i ++) {
        if(Object.prototype.toString.call(arr[i]) == '[object Array]') {
            arr = arr.concat(changeArr(arr[i]));
        } else {
            arr.push(arr[i])
        }
    }
    return arr;
}

// 快速排序
function quickSort(arr, left, right) {
    left = left || 0;
    right = right || arr.length - 1;
    let i = left, j = right;

    let cur = arr[left];
    if(left >= right) return;
    while(i < j) {
        if(arr[j] <= cur && i < j) {
            j --;
        }
        if(arr[i] >= cur && i < i) {
            i ++;
        }

        if(i == j) {
            left /j
        }
        if(i < j) {
            i/j
        }
    }
    quickSort(arr, left, j - 1);
    quickSort(arr, j + 1, right);
    return arr;
}

// DFS BFS
function DFS(treeNode) {
    if(!treeNode) return;
    let stack = [];
    stack.push(treeNode);
    while(stack.length) {
        let cur = stack.pop();
        let {left, right} = cur;
        console.log(cur.val);
        right && stack.push(right);
        left && stack.push(left);
    }
}
function BFS(treeNode) {
    if(!treeNode) return;
    let queue = [];
    queue.push(treeNode);
    while (queue.length) {
        let cur = queue.shift();
        let {left, right} = cur;
        console.log(cur.val);
        left && queue.push(left);
        right && queue.push(right);
    }
}


// debounce
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