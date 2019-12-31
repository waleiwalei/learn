#### 背景
- 多个行程卡下的权益模块里有多个tab,每个tab下面都有一个权益展示;
- 多个行程卡下对应的权益和权益个数都不同

#### 代码实现大致如下：
```js
// 数据结构:
// 行程卡数组
data = [{
    // 每个行程卡对应的权益数组
    type: 'someType',
    serviceItems: [{
        title: 'xx',
        cards: [{},{}]
    },{
        title: 'xx',
        cards: [{},{}]
    }]
}, {
    type: 'someType',
    serviceItems: [{
        title: 'xx',
        cards: [{},{}]
    },{
        title: 'xx',
        cards: [{},{}]
    }]
}]

// render代码大致:
render() {
    return <div>
        {
            data.map((item, i)=>{
                // 这里返回每个行程卡
                return <div>
                    {
                        item.serviceItems.map((serItem, serIndex)=>{
                            return <div key={item.type}>
                                <div>{serItem}</div>
                            </div>
                        })
                    }
                </div>
            })
        }
    </div>
}

```

- 由于每次渲染的时候,每个tab下面对应的该模块使用同一个key,都是后端接口返回的该模块的type,因此切换时,会被认为是同一个组件,会导致状态信息重复,解决办法是拼上一个外层索引,这样就不会机械复用同一个组件,而是有多个子组件,内部有自己的状态信息[根本原因就是这里的state共用了],否则,就需要在同一个组件内部接收props变化去变更各种组件内部状态信息[在willReceiveProps及didUpdate中更新state状态]

- [这个github有相似case的说明-关键字:社会新闻](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/1)