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
```js
export PluginModule<NativeEvent> =  {
    eventTypes: {
        [key: string]: [DispatchConfig],
        // 事件名称，原生Dom事件对象，事件触发的Dom，React组件实例？
        extractEvents: (topLevelType, targetInst, nativeEvent, nativeEventTarget) => {
            // 处理事件，返回合成事件对象
        }
    }
}

export DispatchConfig = {
    dependencies: Array<TopLevelType>,      // 依赖的原生事件
    phasedRegistrationNamesL {
        bubbled: "string",
        captured: "string"
    },
    registrationNames: ?:"string",       // 不支持事件冒泡的事件名称放在这里
    eventPriority: EventPriority,        // 事件优先级
    isInteractive: bool                  // 是否为合成对象
}
```
### 代码整体分析
- ensureListeningTo()
- listenTo()
- ...

#### 事件委托入口
```js
// 将当前事件挂载dom定义为document，事件委托在这里进行
function ensureListeningTo(rootContainerElement, registrationName) {
  var isDocumentOrFragment = rootContainerElement.nodeType === DOCUMENT_NODE || rootContainerElement.nodeType === DOCUMENT_FRAGMENT_NODE;
  var doc = isDocumentOrFragment ? rootContainerElement : rootContainerElement.ownerDocument;
  listenTo(registrationName, doc);
}
```
#### 事件绑定

##### 注册事件的入口【trapCapturedEvent/trapBubbledEvent】
```
/*
 * 注册事件的入口
 * @param {string} registrationName Name of listener (e.g. `onClick`).
 * @param {object} mountAt Container where to mount the listener
 */
function listenTo(registrationName, mountAt) {
  var isListening = getListeningForDocument(mountAt); // 已订阅事件列表
  var dependencies = registrationNameDependencies[registrationName];
 
  // scroll focus blur cancel close  ---> trapCapturedEvent 注册捕获阶段
  // invalid submit reset
  // default  ---> trapBubbledEvent 注册冒泡阶段
  for (var i = 0; i < dependencies.length; i++) {
    var dependency = dependencies[i];
    if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
      switch (dependency) {
        case TOP_SCROLL:
          trapCapturedEvent(TOP_SCROLL, mountAt);
          break;
        case TOP_FOCUS:
        case TOP_BLUR:
          trapCapturedEvent(TOP_FOCUS, mountAt);
          trapCapturedEvent(TOP_BLUR, mountAt);
          // We set the flag for a single dependency later in this function,
          // but this ensures we mark both as attached rather than just one.
          isListening[TOP_BLUR] = true;
          isListening[TOP_FOCUS] = true;
          break;
        case TOP_CANCEL:
        case TOP_CLOSE:
          if (isEventSupported(getRawEventName(dependency))) {
            trapCapturedEvent(dependency, mountAt);
          }
          break;
        case TOP_INVALID:
        case TOP_SUBMIT:
        case TOP_RESET:
          // We listen to them on the target DOM elements.
          // Some of them bubble so we don't want them to fire twice.
          break;
        default:
          // By default, listen on the top level to all non-media events.
          // Media events don't bubble so adding the listener wouldn't do anything.
          var isMediaEvent = mediaEventTypes.indexOf(dependency) !== -1;
          if (!isMediaEvent) {
            trapBubbledEvent(dependency, mountAt);
          }
          break;
      }
      isListening[dependency] = true;    // 更新已订阅列表
    }
  }
}
```


#### 事件分发 
##### trapBubbledEvent
```js
function trapBubbledEvent(topLevelType, element) {
  if (!element) {
    return null;
  }
  // TODO:01.这里为什么要区分开  原因何在？
  var dispatch = isInteractiveTopLevelEventType(topLevelType) ? dispatchInteractiveEvent : dispatchEvent;

  addEventBubbleListener(element, getRawEventName(topLevelType),
  // Check if interactive and wrap in interactiveUpdates
  dispatch.bind(null, topLevelType));
}
```
##### isInteractiveTopLevelEventType 
根据不同的事件类型调用对应插件对象中的isInteractiveTopLevelEventType方法,这里以SimpleEvent为例
- SimpleEventPlugin
```js
var SimpleEventPlugin = {
  eventTypes: eventTypes$4,

  isInteractiveTopLevelEventType: function (topLevelType) {
    /** topLevelEventsToDispatchConfig这个对象就是以原生dom事件名为key，
     *  value格式即为上述介绍的DisPatchConfig结构
     */
    var config = topLevelEventsToDispatchConfig[topLevelType];
    return config !== undefined && config.isInteractive === true;
  },


  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor = void 0;
    switch (topLevelType) {
      // ...省略各种case
      default:
        {
          if (knownHTMLTopLevelTypes.indexOf(topLevelType) === -1) {
            warningWithoutStack$1(false, 'SimpleEventPlugin: Unhandled event type, `%s`. This warning ' + 'is likely caused by a bug in React. Please file an issue.', topLevelType);
          }
        }
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent;
        break;
    }
    // getPooled就是从 event对象池中取出合成事件，这种操作是 React的一大亮点，
    // 将所有的事件缓存在对象池中,可以大大降低对象创建和销毁的时间，提升性能
    var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
    // 根据DOM事件传播的顺序获取用户事件处理器
    accumulateTwoPhaseDispatches(event);
    return event;
  }
};
```
- EnterLeaveEventPlugin
```js
var EnterLeaveEventPlugin = {
  eventTypes: eventTypes$2,
  extractEvents: ()=>{}
}
```
- ChangeEventPlugin
```js
var ChangeEventPlugin = {
  eventTypes: eventTypes$1,

  _isInputEventSupported: isInputEventSupported,

  extractEvents: ()=>{}
}
```
- SelectEventPlugin
```js
var SelectEventPlugin = {
  eventTypes: eventTypes$3,

  extractEvents: ()=>{}
}
```
- BeforeInputEventPlugin
```js
var  BeforeInputEventPlugin = {
  eventTypes: eventTypes,

  extractEvents: ()=>{}
}
```

##### dispatchInteractiveEvent
```js
function dispatchInteractiveEvent(topLevelType, nativeEvent) {
  interactiveUpdates(dispatchEvent, topLevelType, nativeEvent);
}

// 功能函数
function interactiveUpdates(fn, a, b) {
  return _interactiveUpdatesImpl(fn, a, b);
}
var _interactiveUpdatesImpl = function (fn, a, b) {
  return fn(a, b);
};
```

##### dispatchEvent
```js
function dispatchEvent(topLevelType, nativeEvent) {
  if (!_enabled) {
    return;
  }

  // 获取事件目标DOM
  var nativeEventTarget = getEventTarget(nativeEvent);
  // 获取离该dom最近的组件实例
  var targetInst = getClosestInstanceFromNode(nativeEventTarget);
  if (targetInst !== null && typeof targetInst.tag === 'number' && !isFiberMounted(targetInst)) {
    // If we get an event (ex: img onload) before committing that
    // component's mount, ignore it for now (that is, treat it as if it was an
    // event on a non-React tree). We might also consider queueing events and
    // dispatching them after the mount.
    targetInst = null;
  }

  var bookKeeping = getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst);

  try {
    // Event queue being processed in the same cycle allows
    // `preventDefault`.
    // 把当前触发的事件放入批处理队列中handelTopLevel(bookKeeping)
    batchedUpdates(handleTopLevel, bookKeeping);
  } finally {
    releaseTopLevelCallbackBookKeeping(bookKeeping);
  }
}

// 功能函数
// getClosestInstanceFromNode
/**
 * Given a DOM node, return the closest ReactDOMComponent or
 * ReactDOMTextComponent instance ancestor.
 */
function getClosestInstanceFromNode(node) {
  if (node[internalInstanceKey]) {
    return node[internalInstanceKey];
  }

  while (!node[internalInstanceKey]) {
    if (node.parentNode) {
      node = node.parentNode;
    } else {
      // Top of the tree. This node must not be part of a React tree (or is
      // unmounted, potentially).
      return null;
    }
  }

  var inst = node[internalInstanceKey];
  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber, this will always be the deepest root.
    return inst;
  }

  return null;
}
```

##### handleTopLevel
```js
function handleTopLevel(bookKeeping) {
  var targetInst = bookKeeping.targetInst;

  // Loop through the hierarchy, in case there's any nested components.
  // It's important that we build the array of ancestors before calling any
  // event handlers, because event handlers can modify the DOM, leading to
  // inconsistencies with ReactMount's node cache. See #1105.
  var ancestor = targetInst;
  do {
    if (!ancestor) {
      bookKeeping.ancestors.push(ancestor);
      break;
    }
    var root = findRootContainerNode(ancestor);
    if (!root) {
      break;
    }
    // ancestors所有父组件
    bookKeeping.ancestors.push(ancestor);
    ancestor = getClosestInstanceFromNode(root);
  } while (ancestor);

  for (var i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i];
    // 事件执行的入口
    runExtractedEventsInBatch(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
  }
}
```
##### runExtractedEventsInBatch
```js
// 事件执行的入口
function runExtractedEventsInBatch(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  // extractEvents 用于生成合成事件
  var events = extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
  // runEventsInBatch 用于批处理合成事件
  runEventsInBatch(events);
}

// 功能函数
// extractEvents 遍历插件列表处理事件，生成合成事件列表
/**
 * Allows registered plugins an opportunity to extract events from top-level
 * native browser events.
 *
 * @return {*} An accumulation of synthetic events.
 * @internal
 */
function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var events = null;
  for (var i = 0; i < plugins.length; i++) {
    // Not every plugin in the ordering may be loaded at runtime.
    var possiblePlugin = plugins[i];
    if (possiblePlugin) {
      var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
      if (extractedEvents) {
        events = accumulateInto(events, extractedEvents);
      }
    }
  }
  return events;
}

// accumulateInto TODO:02?
/**
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulateInto(current, next) {
  !(next != null) ? invariant(false, 'accumulateInto(...): Accumulated items must not be null or undefined.') : void 0;

  if (current == null) {
    return next;
  }

  // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).
  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }
    current.push(next);
    return current;
  }

  if (Array.isArray(next)) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}
```

##### runEventsInBatch
```js
// <!-- 事件处理器执行, 见后文批量执行 -->
// 回溯到这里，runEventsInBatch就是批量执行_dispatchListeners事件队列里的事件处理器的
function runEventsInBatch(events) {
  if (events !== null) {
    eventQueue = accumulateInto(eventQueue, events);
  }

  // Set `eventQueue` to null before processing it so that we can tell if more
  // events get enqueued while processing.
  // 执行前存储副本并将eventQueue置空，可以检测到执行过程中是否有新的事件进入事件队列
  var processingEventQueue = eventQueue;
  eventQueue = null;

  if (!processingEventQueue) {
    return;
  }

  forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
  !!eventQueue ? invariant(false, 'processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented.') : void 0;
  // This would be a good time to rethrow if any of the event handlers threw.
  rethrowCaughtError();
}
```

#### executeDispatchesAndRelease
#### executeDispatchesAndReleaseTopLevel
#### executeDispatchesInOrder
```js
/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @private
 */
var executeDispatchesAndRelease = function (event) {
  if (event) {
    executeDispatchesInOrder(event);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};
var executeDispatchesAndReleaseTopLevel = function (e) {
  return executeDispatchesAndRelease(e);
};

/**
 * Standard/simple iteration through an event's collected dispatches.
 */
function executeDispatchesInOrder(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;
  {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      // 如果调用stopPropagation 不会调用下面的事件处理器executeDispatch
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and Instances are two parallel arrays that are always in sync.
      executeDispatch(event, dispatchListeners[i], dispatchInstances[i]);
    }
  } else if (dispatchListeners) {
    executeDispatch(event, dispatchListeners, dispatchInstances);
  }
  event._dispatchListeners = null;
  event._dispatchInstances = null;
}

```

#### 插件对事件的处理
以SimpleEventPlugin为例

- 1️⃣ 根据事件的类型确定SyntheticEvent构造器
- 2️⃣ 构造SyntheticEvent对象。
- 3️⃣ 根据DOM事件传播的顺序获取用户事件处理器列表

为了避免频繁创建和释放事件对象导致性能损耗(对象创建和垃圾回收)，React使用一个事件池来负责管理事件对象，使用完的事件对象会放回池中，以备后续的复用；
上述说明意味着在事件处理器同步执行完成后，合成事件对象会被回收到事件对象池，就没有办法在使用，以下有两种方式可以保留引用：
- 调用SyntheticEvent#persist()方法，告诉React不要回收到对象池
- 直接引用SyntheticEvent#nativeEvent, nativeEvent是可以持久引用的，不过为了不打破抽象，建议**不要直接引用nativeEvent**

#### 构建了合成事件对象后，遍历组件树获取订阅事件的用户事件处理器
```js
function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
  }
}

// traverseTwoPhase
/**
 * 模拟从当前事件对象，先倒叙再正序遍历两次
 * Simulates the traversal of a two-phase, capture/bubble event dispatch.
 */
function traverseTwoPhase(inst, fn, arg) {
  var path = [];
  while (inst) {
    path.push(inst);
    inst = getParent(inst);
  }
  var i = void 0;
  for (i = path.length; i-- > 0;) {
    fn(path[i], 'captured', arg);
  }
  for (i = 0; i < path.length; i++) {
    fn(path[i], 'bubbled', arg);
  }
}

// accumulateDirectionalDispatches
/**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */
function accumulateDirectionalDispatches(inst, phase, event) {
  {
    !inst ? warningWithoutStack$1(false, 'Dispatching inst must not be null') : void 0;
  }
  var listener = listenerAtPhase(inst, event, phase);
  if (listener) {
    // _dispatchListeners是批量处理事件处理器的事件队列
    event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
  }
}
```


#### 归档
- _dispatchListeners 事件处理器队列


#### 参考文档
[React事件机制](https://juejin.im/post/5d44e3745188255d5861d654)