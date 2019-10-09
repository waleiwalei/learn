- index.js
- createStore(reducer,preLoadedState,enhancer)
    ```js
    let currentState = preLoadedState,
        currentReducer = reducer,
        currentListeners = [],
        nextListeners = currentListeners;
        
    function dispatch(action) {
        currentState = reducer(currentState, action);
        listeners = (currentListeners = nextListeners);
        for(i-0->listeners.length){
            listeners[i]()
        }
        return action  // 好像平时不会接收dispatch的返回值
    }
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
- bindActionCreaters
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
- combineReducer
    ```js
    /**
     * reducer 多个reducer函数组成的对象
     */
    function combineReducer(reducer) {
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
            return {
                ...store,
                dispatch: newDispatch
            };
        }
    
    }
    
    // 中间件实例
    const logger = store => next => action => {
        console.log('dispatching', action)
        let result = next(action)
        console.log('next state', store.getState())
        // 这个result会在实际调用dispatch时作为结果返回给他的下一个middleware调用dispatch处
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
    ----
- combine
- warning
- DO_NOT_UES__ACTIONTYPES
    
----
    - TODO
        - 异步管理[redux-thunk、redux-promise、redux-saga]
        - 函数式编程（compose）
