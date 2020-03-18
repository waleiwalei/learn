/**
 * function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}
*/
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

class GPromise {
    constructor() {
        this._promiseStatus = PENDING;
        this._promiseValue;
        this.execute(executor);
    }

    execute(executor) {
        if( typeof executor != 'function') {
            throw new Error(`${executor} is not a function`);
        } else {
            try {
                executor( data => {
                    this._promiseStatus = RESOLVED;
                    this._promiseValue = data;
                }, data => {
                    this._promiseStatus = REJECTED;
                    this._promiseValue = data;
                });
            } catch (e) {
                this._promiseStatus = REJECTED;
                this._promiseValue = e;
            }
        }
    }

    /**
     * 不是在创建完promise后就要执行res/rej回调，而是在.then调用时才去判断promise的状态从而执行回调，所以说对应了阮一峰文章中的promise的缺点之一：如果不写then方法，外部无法拿到promise的执行结果(包括错误)
    */
    then(onFulfilled, onRejected) {
        /**
         * 这里新建Promise标明 then方法返回的依旧是个promise类型，即使是其他类型，如简单类型，
         * 也会进行封装，将简单类型的值变为promise对象的属性挂上去
         */
        let _ref, timer, result = new GPromise(()=>{});
        timer = setInterval(() => {
            if((this._promiseStatus == RESOLVED && typeof onFulfilled == 'function') || 
            (this._promiseStatus == REJECTED && typeof onRejected == 'function')) {
                clearInterval(timer);
                try {
                    if(this._promiseStatus == RESOLVED) {
                        _ref = onFulfilled(this._promiseValue);
                    } else if(this._promiseStatus == REJECTED) {
                        _ref = onRejected(this._promiseValue);
                    }

                    /** 
                     * 当res/rej函数返回的依旧是promise时，最终返回promise的状态由这个promise决定
                    */
                    if(typeof _ref == GPromise) {
                        timer = setInterval( () => {
                            if(_ref._promiseStatus == RESOLVED) {
                                clearInterval(timer);
                                result._promiseStatus = RESOLVED;
                                result._promiseValue = _ref._promiseValue;
                            } else if(_ref._promiseStatus == REJECTED) {
                                clearInterval(timer);
                                result._promiseStatus = REJECTED;
                                result._promiseValue = _ref._promiseValue;
                            }
                        });
                    } else {
                        result._promiseStatus = RESOLVED;
                        result._promiseValue = _ref;
                    }

                } catch(e) {
                    result._promiseStatus = REJECTED;
                    result._promiseValue = e;
                }
            }
        });

        return result;
    } 
}