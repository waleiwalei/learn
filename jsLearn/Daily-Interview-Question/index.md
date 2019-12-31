- 3.防抖节流
    + 防抖 debounce
        > 用来缓解频繁的事件触发
        * this/event对象
        * 是否立即执行
        * 取消当前等待 再次立即执行
        * 当需要返回值时,只能在立即执行时return result,否则,非立即执行由于是异步  没法再return时拿到结果
[underscore](https://github.com/mqyqingfeng/Blog/issues/22)
