[underscore](https://github.com/mqyqingfeng/Blog/issues/22)
- 3.防抖节流
    + 防抖 debounce
        > 用来缓解频繁的事件触发
        * this/event对象
        * 是否立即执行
        * 取消当前等待 再次立即执行
        * 当需要返回值时,只能在立即执行时return result,否则,非立即执行由于是异步  没法再return时拿到结果
    + 节流 throttle
        > 在特定时间内只执行一次
        + 时间戳/定时器
        + 是否开始立即执行
        + 结束后是否要执行一次
- 4.Set/weakSet Map/WeakMap
    > 都将NaN视为同一个值
    + Map 的对象键使用内存地址作为索引，因此可以避免“同名属性”碰撞[不用担心跟其他库命名冲突]
    + 如果键是简单类型，则只比较是否===
