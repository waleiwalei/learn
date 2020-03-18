[ink](https://segmentfault.com/a/1190000006103601)

+ Promise执行原理概述
> resolve/reject时将status置为RESOLVED/REJECT [this.status=xxx;],将当前value置为resolve/reject函数参数 [this.value=data;]
> onfulfilled/onrejected时执行fulfilled(this.value)/rejected(this.value)即可


[V8官方实现](https://chromium.googlesource.com/v8/v8/+/3.29.45/src/promise.js?autodive=0/)
