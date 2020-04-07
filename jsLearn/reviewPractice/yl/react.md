[link](https://yuchengkai.cn/react/2019-04-24.html#react-createelement)
[在线生命周期](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
[程墨-面试react常见问题](https://zhuanlan.zhihu.com/p/28176065)
- 受控组件&&非受控组件
    受控组件数据源为store；非受控组件使用ref，就像常规获取dom节点数据一样
- React fiber 
    [st](https://zhuanlan.zhihu.com/p/37095662)
- 如何理解虚拟DOM
    [link](https://www.zhihu.com/question/29504639)
    [虚拟dom原理](https://juejin.im/post/5cb66fdaf265da0384128445)
    + react会将我们jsx代码先转换成js对象，再将js对象转换成真实dom；这个js对象就是所谓的虚拟dom
        ```js
            {
                type: 'div',
                props: {class: 'xxx'},
                children: {
                    // xxx
                }
            }
        ```
    + 当我们对需要创建或更新元素时，会先创建更新虚拟dom，在更新真实dom
    + 当需要对dom进行事件监听时，也先通过虚拟dom，代理真实dom事件进行监听
    + 目的：
        > 使用React，你只需要告诉React你想让视图处于什么状态，React则通过VitrualDom确保DOM与该状态相匹配。你不必自己去完成属性操作、事件处理、DOM更新，React会替你完成这一切
- redux/dva/saga/mobx/flux...
    [link](https://zhuanlan.zhihu.com/p/53599723)
    > Flux 要求，View 要想修改 Store，必须经过一套流程，有点像我们刚才 Store 模式里面说的那样。视图先要告诉 Dispatcher，让 Dispatcher dispatch 一个 action，Dispatcher 就像是个中转站，收到 View 发出的 action，然后转发给 Store。比如新建一个用户，View 会发出一个叫 addUser 的 action 通过 Dispatcher 来转发，Dispatcher 会把 addUser 这个 action 发给所有的 store，store 就会触发 addUser 这个 action，来更新数据。数据一更新，那么 View 也就跟着更新了[**Dispatcher的作用是接收所有的Action，然后发给所有的 Store**]
    + Flux的最大特点就是数据都是单向流动的
    + redux/flux都是单向数据流，1. redux单一数据源，所有子reducer要经过跟reducer整合；flux可以是分离的，每个store负责一个view 2. state只读 3. 纯函数修改state

    + redux-thunk / redux-promise
        * redux-thunk 封装少，自由度高，但是需要自己在then/catch中掌控接口的三种请求状态进行同步dispatch
        * redux-promise 封装多，自由度低，简单易用，将ajax请求作为payload传入 在reducer函数中判断action.status
    + redux将react分为容器形组件、展示型组件
    + react-redux [connect/Provider/mapStateToProps/mapDispatchToProps]
        > 简单来说，react-redux 就是多了个 connect 方法连接容器组件和UI组件，这里的“连接”就是一种映射： mapStateToProps 把容器组件的 state 映射到UI组件的 props mapDispatchToProps 把UI组件的事件映射到 dispatch 方法
    + redux中间件
        [link](https://redux-saga-in-chinese.js.org/)
    + redux-saga
        > redux-thunk 和 redux-promise，当然 redux 的异步中间件还有很多，他们可以处理大部分场景，这些中间件的思想基本上都是把异步请求部分放在了 action creator 中，理解起来比较简单。

        > redux-saga 采用了另外一种思路，它没有把异步操作放在 action creator 中，也没有去处理 reducer，而是把所有的异步操作看成“线程”，可以通过普通的action去触发它，当操作完成时也会触发action作为输出。saga 的意思本来就是一连串的事件。

        > redux-saga 把异步获取数据这类的操作都叫做副作用（Side Effect），它的目标就是把这些副作用管理好，让他们执行更高效，测试更简单，在处理故障时更容易
            [文档](https://redux-saga-in-chinese.js.org/)
    + redux-thunk/redux-saga(redux中间件)
        > 和 redux-thunk 等其他异步中间件对比来说，redux-saga 主要有下面几个特点： 异步数据获取的相关业务逻辑放在了单独的 saga.js 中，不再是掺杂在 action.js 或 component.js 中。 dispatch 的参数是标准的 action，没有魔法。 saga 代码采用类似同步的方式书写，代码变得更易读。 代码异常/请求失败 都可以直接通过 try/catch 语法直接捕获处理。 * 很容易测试，如果是 thunk 的 Promise，测试的话就需要不停的 mock 不同的数据
    + dva
        > redux、react-redux、redux-saga 之类的概念，大家肯定觉得头昏脑涨的，什么 action、reducer、saga 之类的，写一个功能要在这些js文件里面不停的切换。

        >dva 做的事情很简单，就是让这些东西可以写到一起，不用分开来写了 产生了一个model的概念
        > subscriptions TODO:
            用于收集其他来源的 action，比如快捷键操作
    + redux源码解读 见../../reactLearn/reduxLearn
        **一个tip**
        * 在combineReducer中,调用对应reducer后,hasChanged字段的判断条件是 
            ```js
            // 这样，就会导致简单类型的值改变不会触发重新render
            hasChanged = hasChanged || newStateValue !== state[key] 
            return hasChanged ? newState : state;
            ```

- React生命周期有哪些，16版本生命周期发生了哪些变化？
    + 15:
        * 初始化
            1. constructor
            2. getDefaultProps
            3. getInitialState
        * 挂载
            1. willMount
            2. render
            3. didmount
        * 更新
            1. willReceiveProps
            2. shouldUpdate
            3. willUpdate
            4. render
            5. didUpdate
        * 卸载
            1. willUnMount

    + 16:
        > react16新的生命周期出现是因为react fiber异步渲染（async rendering）
        [link](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
        [详细讲解16生命周期~棒-程墨大神](https://zhuanlan.zhihu.com/p/38030418)
        * 初始化
            constructor
        * 挂载
            1. static getDerivedStateFromProps
            2. render
            3. didMount
        * 更新
            1. static getDerivedStateFromProps(nextProps, prevState) {
                    //根据nextProps和prevState计算出预期的状态改变，返回结果会被送给setState
                }
                > 虚拟dom之后，实际dom挂载之前
                > 不能访问this的静态函数，最好是纯函数
                > 16.3是只有props更新会触发，16.4开始props、state及其他forceUpdate更新都会触发(首次render前也会触发)
                > 每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state
            2. shouldComponentUpdate
            3. render
            4. getSnapshotBeforeUpdate(prevProps,prevState) => 返回值snapShort作为didUpdate第三个参数
                > 官方给了一个例子，用getSnapshotBeforeUpdate来处理scroll，坦白说，我也想不出其他更常用更好懂的需要getSnapshotBeforeUpdate的例子，这个函数应该大部分开发者都用不上（听得懂我的潜台词吗：不要用！)
            [这里进行dom更新及refs更新]
            5. didUpdate(prevProps, prevState, snapShort)
        * 卸载
        * 错误处理
            1. componentDidCatch
    + 新周期:
        * getDerivedStateFromProps
        * getSnapshotBeforeUpdate
    + 总结:    
        1. 取消render前will周期，改为只剩shouldUpdate及static方法，强制开发者在render之前只做无副作用的操作，且操作限制在根据新的props及原始state决定新的state 
        2. 为了配合react fiber,防止在render之前的周期被多次调用，产生副作用，如ajax请求(有人会在will周期调用，很明显不符合预期)
- setState是同步的还是异步的？
    + _pendingStateQueue / dirtyComponent
- 为什么有时连续多次 setState只有一次生效？
    + 多次setState在内部实现中是：
        ```js
             _assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);

            // 01
            componentDidMount() {
                this.setState({ index: this.state.index + 1 }, () => {
                    console.log(this.state.index);
                })
                this.setState({ index: this.state.index + 1 }, () => {
                    console.log(this.state.index);
                })
            }
            // 户进行类似Object.assign操作  因此结果上只执行一次加一操作
            _assign(state, {
                index: this.state.index + 1
            }, {
                index: this.state.index + 1
            })

            // 02
            componentDidMount() {
                this.setState((state, props) => ({
                    index: state.index + 1
                }), () => {
                    console.log(this.state.index)
                })
                this.setState((state, props) => ({
                    index: state.index + 1
                }), () => {
                    console.log(this.state.index)
                })
            }

        ```
- React如何实现自己的事件机制？
    + 目的
        1. 抹平浏览器兼容性差异
        2. 事件自定义 典型onChange事件：为表单元素提供统一的值变动事件
        3. 抽象跨平台
        4. React优化 (事件委托，事件绑定至document，简化dom事件处理逻辑)
        5. 干预事件分发 （React16 fiber）
    + https://zhuanlan.zhihu.com/p/35468208
- 为何 React事件要自己绑定 this？
- 原生事件和 React事件的区别？
- React的合成事件是什么？
- React和原生事件的执行顺序是什么？可以混用吗？
- 虚拟Dom是什么？
- Dom diff算法 [link](https://www.infoq.cn/article/react-dom-diff/)
    + 在react中，由状态决定界面展示。在状态变更前后，对应两套状态，这两套状态对应两个dom树，dom diff算法即，对比这两个dom树的差异 
    + 标准diff算法需要O(n^3) facebook工程师将其降低至O(n) 
        > react树对比是按照层级去对比的，他会给树编号0，1，2，3，4.。。然后相同的编号进行比较，所以复杂度是n。
        > 传统diff的算法，除了上面的比较之外，还需要跨级比较。它会将两个树的节点，两两比较，这就有n^2的复杂度了，然后还需要编辑树，编辑树可能发生在任何节点，需要对树进行再一次遍历操作，因此复杂度为n，加起来就是n^3复杂度了
        1. 两个相同组件产生类似dom结构 不同组件产生不同dom结构 [这一假设至今为止没有导致严重的性能问题]
            1. 类型不同 （直接删除并创建 删除意味着彻底销毁，删除整个递归子节点而不再对比，这是O(n)的关键一点）
                > 对dom节点的这种操作同样适用于组件(同一位置前后两个不同组件-删除并创建)
                > 警示我们可以在允许的情况下尽量使用css显示隐藏而不是销毁创建
            2. 类型相同 属性不同
                > 对属性对象进行重设
        2. 对于同一层次的一组子节点，可通过key唯一标识
- 虚拟Dom比 普通Dom更快吗？
    这个说法是错误的，虚拟dom同样需要操作dom，甚至首次渲染时没有任何优势，而且更耗费性能和内存，但是后续dom的更新，由于虚拟dom可以进行diff和批处理，计算出需要更新的最小操作，这个步骤，我们可以在直接操作dom时手动进行，但是没有react做得好，而且会耗费更多的时间和性能，因此，才说虚拟dom帮助我们提高了开发效率
- 虚拟Dom中的 $$typeof属性的作用是什么？
- React组件的渲染流程是什么？
- 为什么代码中一定要引入 React？
- 为什么 React组件首字母必须大写？
- React在渲染 真实Dom时做了哪些性能优化？
- 什么是高阶组件？如何实现？
- HOC在业务场景中有哪些实际应用场景？
- 高阶组件( HOC)和 Mixin的异同点是什么？
- Hook有哪些优势


##### 李煜知乎文章系列
- React解决了哪些问题
    > MVC架构的双向绑定以及一对多的关系容易造成连级/联动（Cascading）修改，对于代码的调试和维护都成问题
- 如何编写一个好的组件
    + 代码层面 代码需要可读性强，复用性高，可维护性好
    + 高内聚，低耦合
        将功能相同的部分拆分出来，记得在修改组件功能时，不能影响其他组件，且不能引入冗余组件
    + S.O.L.I.D
        * 单一职责 react组件推崇功能的组合，而不是继承
        * 接口隔离
        * 依赖反转 ？TODO:
            ```js
                const app = express();
                module.exports = function (app) {
                    app.get('/newRoute', function(req, res) {...})
                };
                // ---> 将控制权交给引用的框架
                module.exports = function plugin() {
                return {
                    method: 'get',
                    route: '/newRoute',
                    handler: function(req, res) {...}
                }
            }
            ```
    + HOC 高阶组件
        ```js
        class BaseComponent extends React.Component {
            render() {
                return (
                <div onClick={this.props.onClick}
                    style={this.props.style}>

                    <h1>{ this.props.title }</h1>
                    <p>{ this.props.content }</p>
                </div>
                );
            }
        }

        // ---> 封装新的组件返回
        const enhance = (WrappedComponent) => {
            return class ClickLogger extends React.Component {
                constructor(props) {
                super(props);
                this.onClick = this.onClick.bind(this);
                }

                onClick(e) {
                console.log(e)
                }

                render() {
                const { title, content } = this.props;
                return (
                    <div>
                    <WrappedComponent {...this.props} onClick={this.onClick} />
                    </div>
                );
                }
            }
        }
        const LoggableComponent = enhance(BaseComponent);
        // 其实也可以使用 class ClickLogger extends BaseComponent; 但是如果有多次复用HOC就很重要？？？TODO:
        ```
    + Container Components
        只负责获取数据的组件，将数据传入下面的展示组件
    + Presentational Components
        只负责展示，数据依赖外部传入，Stateless Components
- Render函数何时执行
    + 只要有setState执行，更改state或者props更改都会执行render[经测试，实际改变的值如果是简单类型，值不变的话，不会重新render，如果变了，即使render函数没有用到，也会重新render；如果是对象类型，指针没有变，就不会render]；
    + shouldComponentUpdate(nextProp, nextState)默认都返回true，如果返回false，不执行render
    + 执行render不代表真实dom更新，在执行render后会在内存中生成virtual dom，与真实dom进行对比后得出最小的dom改动
- 如何对组件进行优化
    + 使用上线构建 去除多余的警告、报错， 减少文件体积
    + 避免重绘 使用shouldComponentUpdate返回false 避免render
    + 尽量使用Immutable data，重新赋值state，这样可以直接判断指针是否发生改变，而不用进行对象的深层比较
    + 尽量添加一个有意义的key值
- Component && Element && Instance
    + Component
        一般意义上的组件：class MyComponent extends React.Component{}
    + Element
        一个JSX创建出来的Object对象 React.createElement返回值
    + Instance
        组件实例 ReactDom.render渲染在DOM上时使用
- 虚拟dom算法 Dom Diff
    [官方文档](https://reactjs.org/docs/reconciliation.html)
    1. 不同类型的两个节点产生不同的树
    2. 开发人员使用key提示哪些节点是稳定的
- Vue双向数据绑定 [link](https://zhuanlan.zhihu.com/p/27829029)
- 
- React服务端渲染
    TODO: 服务端渲染react的生命周期有哪些不同
    [link](https://www.cnblogs.com/BestMePeng/p/react_ssr.html)





