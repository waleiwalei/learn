Function.prototype.bind = function (context, ...args) {
    let fn = this;
    return function() {
        fn.call(context, ...args, ...arguments);
    }
}

Function.prototype.call = function (context = window, ...args) {
    let fn = this;
    context.fn = fn;
    let res;
    res = context.fn(...args);
    delete context.fn;
    return res;
}

function _throttle(fn, wait, options) {
    let context, args, prev = 0, res, remain;
    let {leading, trailing} = options || {};

    function later() {
        prev = leading === false ? 0 : Date.now();
        timer = null;
        res = fn.apply(context, args);
        context = args = null;
    }

    function throttle() {
        context = this;
        args = Array.prototype.slice.call(arguments);
        let now = Date.now();
        if(!prev && leading === false) {
            prev = now;
        }
        remain = wait - (now - prev);
        if(remain <= 0 || remain > wait) {
            if(timer) {
                clearTimeout(timer);
                timer = null;
            }

            prev = Date.now();
            res = fn.apply(context, args);
            context = args = null;
        } else if(!timer && trailing !== false) {
            timer = setTimeout(later, remain);
        }

        return res;
    }

    throttle.cancel = function() {
        clearTimeout(timer);
        timer = null;
    }

    return throttle;
}

function debounce(fn, wait, immediate) {
    let timer = null, context, args, res;

    function later() {
        setTimeout(() => {
            timer = null;
            if(!immediate) {
                res = fn.apply(context, args);
                context = args = null;
            }
        }, wait);
    }

    return function() {
        context = this;
        args = arguments;

        if(!timer) {
            timer = later();
            if(immediate) {
                res = fn.apply(context, args);
            }
        } else {
            clearTimeout(timer);
            timer = later();
        }
        return res;
    }
}

function _debounce(fn, wait, immediate) {
    let timer, context, args, res;

    function later() {
        setTimeout(() => {
            timer = null;
            res = fn.apply(context, args);
            context = args = null;
        }, wait);
    }

    return function () {
        if(!timer) {
            timer = later();
            if(immediate) {
                res = fn.apply(context, args);
            }
        } else {
            clearTimeout(timer);
            timer = later();
        }

        return res;
    }
}


// 深拷贝
function deepClone(obj, map = new WeakMap()) {
    if(obj instanceof RegExp) return new RegExp(obj);
    if(obj instanceof Date) return new Date(obj);
    if(obj === null || typeof obj !== 'object') return obj;

    if(map.has(obj)) {
        return map.get(obj);
    }

    res = {};
    map.set(obj, res);
    for(let k in obj) {
        if(obj.hasOwnProperty(k)) {
            res[k] = deepClone(obj[k], map);
        }
    }

    return res;
}

// 数组去重
function unique(arr) {
    let obj = {}
    return arr.filter((item) => {
        let flag = obj[item];
        obj[item] = 1;
        return flag;
    })
}

// set

// 扁平化
arr.flat(Math.pow(2, 50));
function easy(arr) {
    let res = [];
    while(arr.length) {
        let cur = arr.shift();
        if(Array.isArray(cur)) {
            arr.unshift(...cur);
        } else {
            res.push(cur);
        }
    }
}
function easy(arr) {
    let res = [];
    arr.forEach((item) => {
        if(Array.isArray(item)) {
            res = res.concat(easy(item));
        } else {
            res.push(item);
        }
    })

    return res;
}


Array.prototype.reduceToFilter = function(handler) {
    let _arr = this;
    return _arr.reduce((prev, curr, index) => {
        if(handler(curr, index)) {
            prev.push(curr);
        }
        return prev;
    }, []);
}

// 数组乱序
function changeRandom(arr) {
    arr.forEach((item, i) => {
        let randomNum = Math.floor(Math.random() * arr.length);
        [arr[i], arr[randomNum]] = [arr[randomNum], arr[i]];
    })
    return arr;
}

// 柯里化
function currying(fn, ...args) {
    return fn.length > args.length ?
        () => currying(fn, ...args, ...arguments) :
        fn(...args)
}

// jsonp
function jsonp(url, params, cb, cbName) {
    let script = document.createElement('script');
    let paramsStr = '';
    for(let k in params) {
        if(params.hasOwnProperty(k)) {
            paramsStr += `${k}=${params[k]}&`
        }
    }
    paramsStr += `${url}?${paramsStr}&callback=${cbName}`;
    script.src = paramsStr;
    window[cbName] = (data) => {
        cb && cb(data);
        window[cbName] = undefined;
        document.body.removeChild(script);
    }
    document.body.appendChild(script);
}

var p = new Promise((resolve, reject)=> {
    if(true) {
        resolve();
    } else {
        reject();
    }
})

// promise
function Promise(callback) {
    this.status = 'pending';
    this.data = '';

    function resolve(data) {
        this.status = 'fulfilled';
        this.data = data;
    }

    function reject(err) {
        this.status = 'rejected';
        this.data = err;
    }

    try {
        callback(resolve, reject);
    } catch (error) {
        reject(error);
    }
}
Promise.prototype.then = function (resolve, reject) {
    if(this.status == 'fulfilled') {
        resolve(this.data);
    } else {
        reject(this.data);
    }
}

const Logger = store => next => action => {
    const res = next(action);
    console.log('current state', store.getState());
    console.log('action info', action);
    return res;
}


function quickSort(arr, left, right) {
    left = left || 0;
    right = right || arr.length - 1;
    let i = left, j = right;
    while (i < j) {
        while (i < j && arr[j] > arr[left]) {
            j --;
        }
        while (i < j && arr[i] < arr[left]) {
            i ++;
        }

        if(i == j) {
            [arr[j], arr[left]] = [arr[left], arr[j]];
        } else {
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    quickSort(arr, left, j - 1);
    quickSort(arr, j + 1, right);
    return arr;
}

















const Logger = store => next => action => {
    console.log('action', action);
    const res = next(action);
    console.log('currentState', store.getState());
    return res;
}


//line=readline()
//print(line)
function getHeight(root) {
    let queue = [];
    if(!root) return 0;
    let height = 0;
    queue.push(root);
    while(queue.length) {
        let size = queue.length;
        while(size--) {
            let curr = queue.shift();
            let {left, right} = curr;
            left && queue.push(left);
            right && queue.push(right);
        }
        height ++;
    }
    return height;
}

function f(root) {
    return (Math.abs(getHeight(root.left) - getHeight(root.right)) <= 1) && f(root.left) && f(root.right);
}
f(root);





//line=readline()
//print(line)

Promise.prototype.all = function(promises, num) {
    let curLength = 0, res = [];

    function addPromise(res, rej) {
        return new Promise((resolve) => {
            let promise = promises.shift();
            curLength ++;
            Promise.resolve(promise).then((data)=>{
                res.push(data);
                curLength --;
                res();
                if(res.length == promises.length) {
                    resolve(res);
                    return;
                }
            }, (err) => {
                reject(err);
                return;
            })
        })
    }
    
    return new Promise((resolve, reject) => {
        for(let i = 0; i < num; i ++) {
            addPromise(resolve, reject)
        }
    })
}


Promise.prototype.race = function(promises) {
    return new Promise((resolve, reject) => {
        for(let i = 0 ; i < promises.length; i ++) {
            Promise.resolve(promises[i]).then((data)=>{
                resolve(data);
                return;
            }, (err)=>{
                reject(err);
                return;
            })
        }
    })
}

