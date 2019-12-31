#### 2
- 回调超时
```js
function timeoutify(fn, timeout) {
    var timer = setTimeout(function(){
        timer = null;
        fn(new Error('timeout'));
    }, timeout);

    return function() {
        if(timer) {
            clearTimeout(timer);
            fn.apply(this, arguments);
        }
    }
}
```
- Zalgo
```js
// TODO:?
function asyncify(fn) {
    var async_fn = fn;
    var timer = setTimeout(function() {
        timer = null;
        if(fn) fn()
    }, 0);
    fn = null;
    return function() {
        if(timer) {
            fn = async_fn.bind.apply(
                async_fn,
                [this].concat( [].slice.call(arguments) )
            )
        } else {
            async_fn.apply(this, arguments);
        }
    }
}
```

- Promise
    > 针对回调控制被反转的反转[拥有代码自主权]
    > 对未来值的承诺
    + 控制反转的好处是：bar(foo)/baz(foo)
        > foo不需要知道bar.baz在做什么,甚至不需要知道他们的存在;bar.baz也不需要知道foo的调用细节
    + 传递promise还是由promise控制[没有对错，不同场景]
    ```js
    var p = new Promise(xxxx);
    // -01
    function bar(){}
    function baz(){}
    // 只有p成功决议才会执行bar
    p.then(bar,xx); p.then(baz,xx);
    // -02
    // 由bar自己控制成功失败的执行过程,p不管成功失败都会执行bar、baz
    function bar(){
        p.then(xx,xx);
    }
    function baz(){}
    bar(p); baz(p);
    ```