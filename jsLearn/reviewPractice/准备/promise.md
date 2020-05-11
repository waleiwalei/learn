

Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        if(!promises.length) {
            return;
        }
        for(let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(data => {
                return resolve(data);
            }, err => {
                return reject(err);
            })
        }
    })
}
Promise.prototype.done = function(onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
        .catch(err => throw new Error(err))
}


Promise.prototype.finally = function(cb) {
    P = this.constructor;
    return this.then(
        value => P.resolve(cb()).then(() => value),
        err => P.resolve(cb()).then(() => throw new Error(err))
    )
}


### 参考链接
[link](https://juejin.im/post/5c88e427f265da2d8d6a1c84)

### 要多些几次啊  作者写了七八次呢

Promise.all = function(promises, num) {
    res = [], index = 0;
    return new Promise((resolve, reject) => {
        _all = function() {
            Promise.resolve(promises[index]).then(data => {
                if(index == num) {
                    return resolve(res);
                } else {
                    res[index] = data;
                    _all();
                }
            })
        }
        new Array(num).forEach(()=> _all());
    })

}