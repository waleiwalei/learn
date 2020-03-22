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
        箭头函数当做普通函数调用时this指向调用他的对象，当做对象方法时this指向执行上下文this
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
        > [link](https://www.cnblogs.com/dongcanliang/p/7054176.html)
    + 立即执行函数
        立即执行函数this指向全局
        > [link](https://www.jianshu.com/p/89c2aa2e9ebc)

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
