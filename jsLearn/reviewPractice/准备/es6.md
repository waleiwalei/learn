### 箭头函数
- this（继承当前上下文this）
- arguments
- 构造函数
- yield

### let var const
```js
var arr = [];
for (let i = 0; i < 10; i++) {
  arr[i] = function () {
    console.log(i);
  }
}
arr[5]()

// 01 闭包
function foo(i) {
    return function() {
      return i;
    }
}
for (var i = 0; i < 10; i++) {
    arr[i] = foo(i)();
}

// 02 IIFE
for (var i = 0; i < 10; i++) {
    arr[i] = (function(i){
        return function(){
          return i
        }
    })(i);
}

// forEach
let arr = [0, ...9];
arr.forEach((item,i)=>{
    console.log(i)
})
```

### class
- es6 class extends是组合继承方式实现，super()相当于调用了Parent.call(this,xxx);
### 模板字符串
### Promise
+ Promise构造函数同步执行，then异步执行
+ Promise 中reject 和 catch 处理上有什么区别
    - reject 是用来抛出异常，catch 是用来处理异常
    - reject 是 Promise 的方法，而 catch 是 Promise 实例的方法
    - reject后的东西，一定会进入then中的第二个回调，如果then中没有写第二个回调，则进入catch
    - 网络异常（比如断网），会直接进入catch而不会进入then的第二个回调 
```js
// -01 手写promise
var promise = new Promise((resolve, reject) => {
  if (操作成功) {
    resolve(value)
  } else {
    reject(error)
  }
})
promise.then(function (value) {
  // success
}, function (value) {
  // failure
})



// -02 怎么解决回调函数里面回调另一个函数，另一个函数的参数需要依赖这个回调函数。需要被解决的代码如下：
$http.get(url).success(function (res) {
  if (success != undefined) {
    success(res);
  }
}).error(function (res) {
  if (error != undefined) {
    error(res);
  }
});

function success(data) {
  if（ data.id != 0） {
    var url = "getdata/data?id=" + data.id + "";
    $http.get(url).success(function (res) {
      showData(res);
    }).error(function (res) {
      if (error != undefined) {
        error(res);
      }
    });
  }
}
// ->
var promise = new Promise((resolve, reject)=>{
    $http.get(url1).success((res)=>{
        resolve(res);
    }).error((err)=>{
        reject(err);
    })
}).then((res)=>{
    return new Promise((resolve, reject)=>{
        $http.get(url2).success((res)=>{
            resolve(res);
        }).error((err)=>{
            reject(err);
        })
    })
}).then((res)=>{
    showData(res);
}).catch((err){

});
// -> 
Promise.resolve($http.get(url1)).then((res)=>{
    return Promise.resolve($http.get(url2));
}).then((res)=>{
    showData(res);
}).catch((err){

});

// -03 jQuery的ajax返回的是promise对象吗
// jquery的ajax返回的是deferred对象，通过promise的resolve()方法将其转换为promise对象。
var jsPromise = Promise.resolve($.ajax('/whatever.json'));
// **附**
// Promise.all()都成功才成功，返回结果数组；有一个失败就失败，返回失败；
// Promise.race() 不关注结果 有一个返回 状态立刻变更为该返回

// -04
// 1 2 4 3
const promise = new Promise((resolve, reject) => {
  console.log(1)
  resolve()
  console.log(2)
})
promise.then(() => {
  console.log(3)
})
console.log(4)

// -05
// p1<pending>
// p2<pending>
// throw New Error
// p1 <resolve>success
// p2 <reject>err
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})

console.log('promise1', promise1)
console.log('promise2', promise2)

setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)


// -06
// success1
const promise = new Promise((resolve, reject) => {
  resolve('success1')
  reject('error')
  resolve('success2')
})

promise
    .then((res) => {
        console.log('then: ', res)
    })
    .catch((err) => {
        console.log('catch: ', err)
    })
// -07 ？？？
// 可以理解为catch是then的另一种写法，第一个函数没有传，即下面-10的情况，所以参数透传给最后一个then
// 1 2
Promise.resolve(1)
  .then((res) => {
    console.log(res)
    return 2
  })
  .catch((err) => {
    return 3
  })
  .then((res) => {
    console.log(res)
  })
// -07-2  
// 1 3
Promise.resolve(1)
  .then((res) => {
    console.log(res)
    throw new Error('test')
  })
  .catch((err) => {
    return 3
  })
  .then((res) => {
    console.log(res)
  })

// -08 
// !!!
// then: Err error!!!
Promise.resolve()
  .then(() => {
    // 相当于return Promise.resolve(new Error('error!!!')) Promise会对返回的非Promise进行转化
    return new Error('error!!!')
  })
  .then((res) => {
    console.log('then: ', res)
  })
  .catch((err) => {
    console.log('catch: ', err)
  })

// -09
// !!!promise不能返回自身 会造成死循环
// TypeError
const promise = Promise.resolve()
  .then(() => {
    return promise
  })
promise.catch(console.error)

// -10 then/catch如果不传函数，会发生值透传
// 1
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)

// -11 
// 注意throw newError会造成reject。但是return new Error不会，会包装成resolve返回
// fail2: Err error
Promise.resolve()
  .then(function success (res) {
    throw new Error('error')
  }, function fail1 (e) {
    console.error('fail1: ', e)
  })
  .catch(function fail2 (e) {
    console.error('fail2: ', e)
  })

// -12
// 同步任务-微任务-事件周期
// end nextTick then setImmediate
process.nextTick(() => {
  console.log('nextTick')
})
Promise.resolve()
  .then(() => {
    console.log('then')
  })
setImmediate(() => {
  console.log('setImmediate')
})
console.log('end')

// -12-2
// nextTick优先级高于promise 先输出
// end nextTick then setImmediate
Promise.resolve()
  .then(() => {
    console.log('then')
  })
process.nextTick(() => {
  console.log('nextTick')
})

setImmediate(() => {
  console.log('setImmediate')
})
console.log('end')
```
### set map
- set 用于数据重组
    + set结构非简单类型也要以内存地址区分是否重复
    + size/add()/delete()/has()/clear()
    + Array.from(set) => set转数组（数组去重：先set再from）
        ```js
        let arr = [1, 2, 3, 1];
        arr = Array.from(new Set(arr));
        // 或者直接...操作符
        arr = [...new Set(arr)];
        ```
    + keys()/values()/entries()/forEach()
    + ...操作符
    + 不能在遍历操作中直接改原set 但是可以map后赋值给原set或者
    + 求交集、并集、差集
        ```js
        let a = new Set([1, 2, 3]);
        let b = new Set([4, 3, 2]);

        // 并集
        let union = new Set([...a, ...b]);
        // Set {1, 2, 3, 4}

        // 交集
        let intersect = new Set([...a].filter(x => b.has(x)));
        // set {2, 3}

        // 差集
        let difference = new Set([...a].filter(x => !b.has(x)));
        ```
- map 用于数据存储
    + 解决传统只能用字符串当做key的问题
    + 小心内存地址相同，而不是属性值相同
    + NaN被视为同一个值（+0、0、-0）
    + size/set()/get()/has()/delete()/clear()
    + keys()/values()/entries()/forEach()
    + map的遍历顺序是插入顺序
    ```js
    map[Symbol.iterator] === map.entries
    // true
    ```
    + map->数组
    ...操作符
    + 结合数组的map、filter对Map遍历和过滤（同set）
    + 对象转Map
    ```js
    // [['a', 1], ['b', 2]]
    let arr = Object.entries({a: 1, b: 2});
    new Map(arr)
    ```
    + Map->JSON 先转对象再转JSON 或转为二维数组转JSON（有非字符串属性值）

### async-await
- async函数表示函数里面可能会有异步方法，await后面跟一个表达式
- async方法执行时，遇到await会立即执行表达式，然后把表达式后面的代码放到微任务队列里，让出执行栈让同步代码先执行
### 理解 async/await以及对Generator的优势
- async await 是用来解决异步的，async函数是Generator函数的语法糖
- 使用关键字async来表示，在函数内部使用 await 来表示异步
- async函数返回一个 Promise 对象，可以使用then方法添加回调函数
- 当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句
- async较Generator的优势：
    1. 内置执行器。Generator 函数的执行必须依靠执行器，而 Aysnc 函数自带执行器，调用方式跟普通函数的调用一样
    2. 更好的语义。async 和 await 相较于 * 和 yield 更加语义化
    3. 更广的适用性。yield命令后面只能是 Thunk 函数或 Promise对象，async函数的await后面可以是Promise也可以是原始类型的值
    4. 返回值是 Promise。async 函数返回的是 Promise 对象，比Generator函数返回的Iterator对象方便，可以直接使用 then() 方法进行调用
### import / export
### 装饰器 @ decorator
### symbol
- Symbol属性不会出现在常规对象属性名的遍历中
- 设计一个对象，键名的类型至少包含一个symbol类型，并且实现遍历所有key。（编程题）
```js
let name = Symbol('name');
let product = {
    [name]: "洗衣机",
    "price":799
};
// Reflect.ownKeys 返回所有类型的键名
Reflect.ownKeys(product);
```
### Reflect
- es6将明显应该是内部可见的方法加到Reflect上 如Object.defineProperty
- 修改某些Object方法的返回结果 让其变得更合理 如Object.defineProperty无法设置会抛出错误，Reflect.defineProperty返回false
- 让Object操作都变成函数行为
    ```js
    // 老写法
    'assign' in Object // true
    delete obj.name

    // 新写法
    Reflect.has(Object, 'assign') // true
    Reflect.deleteProperty('name')
    ```
- 与Proxy对象方法一一对应
### proxy
- 重载了.运算符
- var proxy = new Proxy(target, handler);
    + target 拦截的目标对象
    + handler 定制拦截行为
    **注意**
    + 要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作
```js
// 验证输入设置的数据是否符合预期
function Person(name, age) {
	this.name = name;
	this.age = age;
	return _proxy(this, checkPerson);
}
function _proxy(target, checkObj) {
	let _checkObj = checkObj;
	return new Proxy(target, {
		get(target, keyName) {
			return Reflect.get(target, keyName);
		},
		set(target, keyName, value) {
			if(target.hasOwnProperty(keyName)) {
				if(!!_checkObj[keyName](value)) {
					return Reflect.set(target, keyName, value);
				} else {
					throw new Error('set ' + keyName + ' error');
				}
			}
		}
	});
}
const checkPerson = {
	name: (name) => {
		return typeof name === 'string'
	},
	age: (age) => {
		return typeof age === 'number' && age > 0
	}
}
let person1 = new Person('test', 20);
person1.name = 2;
console.log(person1.name)
```
```js
// 有一本书的属性为：{“name”:“《ES6基础系列》”, ”price”：56 }；
// 要求使用Proxy对象对其进行拦截处理，name属性对外为“《ES6入门到懵逼》”,price属性为只读
let book  = {"name":"《ES6基础系列》","price":56 };
let proxy = new Proxy(book,{    
  get:function(target,property){        
    if(property === "name"){            
      return "《入门到懵逼》";
    }else{            
      return target[property];
    }
  },    
  set:function(target,property,value){        
    if(property === 'price'){
      target[property] = 56;
    }
  }
});
proxy.price = 5
console.log(proxy.price) // 56
```
### 解构
+ [a, b] = [b, a] 实现变量交换
### ...
### for...of

[link](https://www.cnblogs.com/fengxiongZz/p/8191503.html)
[link2](https://www.cnblogs.com/theblogs/p/10575845.html)