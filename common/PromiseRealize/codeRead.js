// https://github.com/then/promise/blob/master/src/core.js
function noop() {}
var IS_ERROR = {};
var LAST_ERROR = null;
function tryCallOne(fn, a) {
    try {
      return fn(a);
    } catch (ex) {
      LAST_ERROR = ex;
      return IS_ERROR;
    }
  }
function tryCallTwo(fn, a, b) {
    try {
        fn(a, b);
    } catch (error) {
        LAST_ERROR = error;
        return IS_ERROR;
    }
}

function Promise(fn) {
    // ?
    if(typeof this !== 'object') {
        throw new TypeError('Promises must be constructed by new');
    }
    if(typeof fn !== 'function') {
        throw new TypeError('Promise constructor\'s argument is not a function');
    }
    this._deferredState = 0;
    this._state = 0;
    this._value = 0;
    this._deferreds = null;

    // ???
    if(fn === noop) return;
    doResolve(fn, this);
}

function doResolve(fn, promise) {
    var done = false;
    var res = tryCallTwo(fn, function(value) {
        if(done)return;
        done = true;
        resolve(promise, value);
    }, function (reason) {
        if(done) return;
        done = true;
        reject(promise, reason);
    })
    // ??? ===
    if(!done && res === IS_ERROR) {
        done = true;
        reject(promise, LAST_ERROR);
    }
}

function resolve(self, newValue) {
    if (newValue === self) {
        return reject(
            self,
            new TypeError('A promise cannot be resolved with itself.')
        );
    }
}