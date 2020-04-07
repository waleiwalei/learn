#### 整体/重点关注
* createStore依据enhancer参数决定在当前位置创建store或将createStore传入enhancer并执行[这里返回的是一个经过applyMiddleware返回的函数,createStore接受他的参数从而创建store]
* applyMiddleware(...funcS)接受n个函数参数,封装createStore,实现与其类似的功能,在这个返回函数中,利用compose结合reduce倒叙执行传入的中间件,初始中间件的next参数为store.dispatch,最后返回的store只变更其中的dispatch方法
```js
// 最终返回的是一个reducer
const middleware1 = store => next => action => {
    const storeAfterPreMiddleware = next(action);
    // 再做自己组件需要的处理
    return storeAfterThisMiddleware;
}

const middleware2 = store => next => action => {
    const storeAfterPreMiddleware = next(action);
    // 再做自己组件需要的处理
    return storeAfterThisMiddleware;
}

applyMiddleware(middleware2, middleware1);
// 可以理解为next参数就是action分发函数dispatch
// chain: [next => action => {}, next => action => {}]
// compose(...chain)(store.dispatch) 首个middleware1的next = store.dispatch;后续next都是前一个middleware返回的 action => {}
// 最终调用经过applyMiddleware后的dispatch时,就会依次调用每个middleware上一个next函数,到最后一个middleware时,执行完他自己的代码逻辑后返回的就是最终的store
function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preLoadedState, enhancer) => {
        const store = createStore(reducer, preLoadedState, enhancer);
        const middlewareAPI = {
            getState: ...store.getState,
            dispatch: (action) => dispatch(action)
        }
        const chain = middlewares.map( (middleware) => middleware(middlewareAPI))
        const dispatch = compose(...chain)(store.dispatch)
        return {
            ...store, dispatch
        }
    }
}
```

#### 代码解读
- index.js
- createStore(reducer,preLoadedState,enhancer)
    * reducer 一个返回新的state的函数
    * preLoadedState 初始state、当前state
    * enhancer store增强器,一般用作加入中间件,在redux中惟一的使用中间件方式就是applyMiddleware()
    ```js
    if(enhancer && typeOf enhancer === 'function') {
        // enhancer对应项目代码中createStore的最后一个参数即是:applyMiddleware(xxx)的返回函数,即:
        // function applyMiddleware(...middlewares) {
        //     return (createStore) => (reducer, preloadedState, enhancer) => {}
        // }
        // 传入createStore并在applyMiddleware中调用一次,生成store

        // 有enhancer,直接在applyMiddleware中调用createStore生成store
        return enhancer(createStore)(reducer, preloadedState);
    } 
    // 不存在enhancer,代码向下执行 在最后生成store结构
    let currentState = preLoadedState,
        currentReducer = reducer,
        currentListeners = [],
        nextListeners = currentListeners;
        
    // ?listeners
    function dispatch(action) {
        currentState = reducer(currentState, action);
        listeners = (currentListeners = nextListeners);
        for(i-0->listeners.length){
            listeners[i]()
        }
        return action  // 好像平时不会接收dispatch的返回值
    }
    // (如何理解redux中subscribe)[https://segmentfault.com/q/1010000012332458]
    // 由于dispatch(action)后,数据改变但是没有重新render,因此增加事件订阅模式,数据变更后自动render
    // react-redux 负责调用subscribe订阅事件,dispatch(action)后执行对应的listener[store.subscribe]
    // 注册监听器
    function subscribe(listener) {
        ensureCanMutateNextListeners();
        nextListeners.push(listener);
        return function unsubscribe() {
            ensureCanMutateNextListeners();
            let index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
        }
    }
    function getState() {
        // 参dispatch函数中:currentState = reducer(currentState, action);
        return currentState
    }
    function replaceReducer(nextReducer) {
        currentReducer = nextReducer;
        dispatch({ type: ActionTypes.REPLACE});
    }
    function observable() {
        // TODO:
    }
    
    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [$$observable]: observable
    }
    ```
- bindActionCreators
    * bindActionCreators方便的实现了不引入dispatch方法直接通过普通的函数调用触发dispatch(action)
    * 返回结果是以action为key的对象
    ```js
    // 单个dispatch action的调用返回
    function bindActionCreator(actionCreator, dispatch) {
        return function() {
            return dispatch(actionCreator.apply(this, arguments));
        }
    }
    function bindActionCreators(actionCreator, dispatch) {
        if(typeof actionCreator === 'function') {
            return bindActionCreator(actionCreator, dispatch);
        }
        if(typeof actionCreator !== 'object' || actionCreator === null) {
            throw new Error();
        }
    
        // action创建函数组成的对象
        // 返回每个的dispach action组成的对象
        const actionKeys = Object.keys(actionCreator);
        let boundActionCreators = {};
        for(let key in actionKeys) {
            if(typeof actionCreator[key] === 'function') {
                boundActionCreators[key] = bindActionCreator(actionCreator[key], dispatch);
            }
        }
        return boundActionCreators;
    }
    ```
- combineReducers
    ```js
    /**
     * reducer 多个reducer函数组成的对象
     */
    function combineReducers(reducer) {
        let reducerKeys = Object.keys(reducer);
        let finalReducer = {};
        for(let key in reducerKeys) {
            if(typeof finalReducer[key] === 'function') {
                finalReducer[key] = reducer[key];
            }
        }
        return function combination(state, action) {
            let hasChanged = false;
            let finalReducerKeys = Object.keys(finalReducer);
            let newState = {};
            for(let key in finalReducerKeys) {
                let curStateValue = state[key];
                let reducer = finalReducer[key];
                let newStateValue = reducer(curStateValue, action);
                newState[key] = newState;
                hasChanged = hasChanged || newStateValue !== state[key]
            }
    
            return hasChanged ? newState : state;
        }
    }
    ```
- applyMiddleware
    ```js
   function applyMiddleware(...middlewares) {
        // return的函数即为在createStore中调用的enhancer
        return (createStore) => (...args) => {
            const store = createStore(args);
    
            const newStore = {
                getState: store.getState,
                dispatch: (...args) => dispatch(...args)
            }
            
            // 这里先把middlewares最外层珂里化传入store去掉
            const chains = middlewares.map((middleware) => middleware(newStore));
            // 将store.dispatch作为初始dispatch传入最后右边的middleware(即第一个调用的middleware),然后返回middleware最后一层珂里化函数，
            // 即为当前middleware返回的结果dispatch，这个返回值作为下一个middleware的初始dispatch进行作用
            // 所以实际上的middleware链式调用返回的最终disptach是middleware链子中的最后一个middleware返回的那个dispatch方法，
            // 但是，由于是链式调用，每个middleware中都会调用上一个middleware的dispatch，递归到最后，第一个middleware调用的就是初始store.dispatch
            // 这实际上就是不去变更初始store的disptach方法【store.dispatch=newDispatch()=>{}】而只在最后用解构覆盖掉返回去的store
            const newDispatch = compose(...chains)(store.dispatch);
            // 除了dispatch之外的东西都照常使用createStore中生成的返回结构
            return {
                ...store,
                dispatch: newDispatch
            };
        }
    
    }
    
    // 中间件实例
    // 中间件最终返回的是一个reducer函数,接受action,返回新的state
    const logger = store => next => action => {
        console.log('dispatching', action)
        let result = next(action)
        console.log('next state', store.getState())
        // 这个action=>{}函数会作为参数传递给下一个middleware的next参数:next=>action=>{}
        return result
    }

    // 项目中间件实例
    /**
     * 为每个action设置上store对象
     */

    export default function RootStore({dispatch, getState}) {
        return function (next) {
            return function (action) {
                if (action.type && !action.store) {
                    action.store = getState();
                }
                return next(action);
            }
        }
    }

    ```
- compose 
```js
function compose(...funcS) {
    if(funcS.length === 1) {
        return funcS[0];
    }
    return funcS.reduce( (x, y) => (...args) => x(y(args)) )
}
/* eg: funcS = [a,b,c];
Round1: x = a, y = b;
retFunc: (...args1) => a(b(args1))
Round2: x = retFunc, y = c;
retFunc2: (...args2) => retFunc(c(args2))
args1 -> c(args2), 因此:
finalRetFunc: (...args2) => a(b(c(args2)))
是一个递归的过程,后一个函数的调用会作为前一个函数的参数传回去 */
```


    ----
- combine
- warning
- DO_NOT_UES__ACTIONTYPES
    
    
    - TODO
        ```js
        - react-redux
        - 异步管理[redux-thunk、redux-promise、redux-saga]
        // - 函数式编程（compose） reduce用于函数compose
        ```