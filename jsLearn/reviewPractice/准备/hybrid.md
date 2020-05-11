### App 
- App概念来源于Google研发出Android，Apple研发出IOS后
### H5渗入App
- 原生APP开发有一个webview组件[一个APP组件，小型浏览器内核]，adr中是webview，ios中7以下是UIWebview,7以上是WKWebview，可以加载html文件
### Hybrid
- 混合开发，半原生，半web 原生做容器，内里用web实现
    + 底层通过原生实现 业务逻辑由h5实现 最终原生容器加载h5 完成app
    + 成熟的hybrid开发，原生只提供底层API，其他业务都由h5实现 即可以跨平台开发 开发一次 与各平台容器组合
- 基本原理
    + 通过JSBridge[一种JS和Native通信机制] H5可以调用Native的API Native也可以调用H5的方法或通知H5页面回调
- 根据web与native的混合程度划分类型
    + 多view混合型 几乎是原生开发 web只作为辅助 很少用到了
    + 单view混合型 同一个view内同时包含native view 和web view
    + web主体型 传统意义上的Hybrid开发 hybrid提供各种打包工具调试工具 开发不会用到任何原生东西 只需要html js
    + 多主体共存型（灵活型）二者共存 在性能要求较高时使用native 前提是要有专业的adr、ios开发
- Hybrid 使用file协议(无法实现跨域哦)
    + file协议 本地文件传输协议 访问本地计算机文件 如右键打开文件夹
    + 打开方式 file:///文件路径
    + 为什么三个/// 
        * 结构 scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
        * 用http类比 https://blog.csdn.net/lishanleilixin/article/category/7191777
        * 文件没有host 因此去掉了host部分 就是三个/相连
- Hybrid更新流程由客户端控制 H5的开发人员只能即时更新服务器静态资源
- 更新过程
    1. 分版本，有版本号
    2. 将静态文件压缩成zip包，上传到服务器
    3. 客户端每次启动，都要去服务端检查版本号
    4. 如果服务端版本号大于客户端版本号，就去下载最新的zip包
    5. 下载完之后解压包，然后将现有文件覆盖
### Native/Hybrid/web/React native
- Native 原生开发 性能最佳 学习成本高 开发成本大 更新周期长需要审核更新apk等 无法跨平台
- web 使用方便 资源在服务器 更新快，只需要更新服务器资源即可 太过依赖网络环境 消耗资源多，尤其移动端 用户留存率低 跨平台 功能受限
- Hybrid 跨平台 易于维护 更新较为自由，只需要替换资源文件 学习成本低 性能比web更好 部分要求性能页面可采用native实现 不适用于交互性强，如动画 性能损耗较多 (没有更高的权限 如地理位置 拍照等)
- React native 跨平台 开发成本略大 性能优于hybrid且不逊色于native 社区庞大（除了hybrid都有这个特性）
    + 虽说跨平台 但是底层部分代码adr与ios还是有一定差异性 需要维护开发
### JSBridge
- 简单来说就是给js提供调用native功能的接口
- 核心是给native和非native构建双向通信的通道

    + JSBridge通信原理，有哪几种实现的方式？

        * JsBridge给Javascript提供了调用Native功能，Native也能够操控JavaScript。这样前端部分就可以方便使用地理位置、摄像头以及登录支付等Native能力了。JsBridge构建Native和非Native间消息通信的通道，而且是双向通信的通道。

        * JS向Native发送消息：调用相关功能，通知Native当前JS的相关状态等。 Native向JS发送消息：回溯调用结果、消息推送、通知JS当前Native的状态等
- JS调用Native两种方式
    1. API注入 将native功能通过webview接口注入到window对象
    2. 拦截url scheme 通过iframe.src [scheme: 自定义protocol+host]
- 一个jsBridge的简单实现
```js
(function() {
    var id = 0, callbacks = [], registerFunc = [];

    window.JSBridge = {
        // 调用native功能
        invoke: function(bridgeName, data, callback) {
            var thisId = id++;
            callbacks[thisId] = callback;
            nativeBridge.postMessage({
                bridgeName,
                data,
                callbackId: thisId
            })
        },
        receiveMsg: function(msg) {
            var {bridgeName, data, callbackId, responseId} = msg;
            // callbackId和bridgeName不同时存在
            if(callbackId) {
                callbacks[callbackId](data);
            } else if(bridgeName) {
                if(registerFunc[bridgeName]) {
                    var ret = {};
                    registerFunc[bridgeName].forEach(function (callback) {
                        callback(data, function(r) {
                            flag = true;
                            ret = Object.assign(ret, r);
                        })
                    });
                    nativeBridge.postMessage({
                        responseId: responseId,
                        ret
                    })
                }
            }

        },
        register: function(bridgeName, callback) {
            if(!registerFunc[bridgeName]) {
                registerFunc[bridgeName] = []
            } else {
                registerFunc[bridgeName].push(callback);
            }
        }
    }
})()
```



### JSBridge常见功能
#### 通用功能
- 自定义titleBar/左右按钮
- 打开webview承接新的url
- 关闭当前webview
- 关闭前面webview
- 下拉刷新
- app唤起
#### 业务功能
- 页面分享
- 支付
- 调用相机。图片上传
- 定位
#### 
[JSBridge原理](https://juejin.im/post/5abca877f265da238155b6bc)
### 参考
[link](https://www.cnblogs.com/dailc/p/5930231.html)
