# React事件机制
## 简介
React没有像原生事件绑定一样，将事件绑定在原生dom上，而是采用事件委托，将所有事件绑定在最外层document上，在冒泡阶段触发事件；
当发生dom变化（挂载、卸载组件）时，只需要在统一事件监听位置增删对象，便于管理，提高效率。

React没有使用浏览器事件，而是基于Virtual Dom实现了合成事件（SyntheticEvent），符合W3C事件标准，因此可以采用stopPropagation() / preventDefault() 阻止事件过程。

## 目的
- 跨平台
- 参与事件处理过程，利于fiber
- 通过事件委托优化性能
- 合并表单dom事件等 例如change事件

## 流程图
<参image.png>

### 
- ReactEventListener 事件处理器的绑定，当dom触发事件时从这里开始调度分发到React组件树
- ReactEventEmitter 暴露接口给React组件 用于添加事件订阅
- Event Propagators 按照事件传播的两个阶段，遍历React的dom树，收集组件的事件处理器
- Plugin React事件系统使用插件机制来管理不同行为的事件这些插件会处理对应的事件类型并返回合成对象
EventPluginHub 负责合成事件对象的创建和销毁

## 事件分类及事件优先级

### 分类
1.离散事件DiscreteEvent
2.用户阻塞事件UserBlockingEvent
3.可连续事件ContinuousEvent

### 优先级
- Immediate 这个优先级的任务会同步执行, 或者说要马上执行且不能中断
- UserBlocking(250ms timeout) 这些任务一般是用户交互的结果, 需要即时得到反馈 .
- Normal (5s timeout) 应对哪些不需要立即感受到的任务，例如网络请求
- Low (10s timeout) 这些任务可以放后，但是最终应该得到执行. 例如分析通知
- Idle (no timeout) 一些没有必要做的任务 (e.g. 比如隐藏的内容).

## 具体实现解析
react事件主要分为 绑定 分发

### 前序知识：React插件结构
```

```