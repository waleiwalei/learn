[link](https://blog.csdn.net/yaocong1993/article/details/84652913)
- OSI模型
    + 应用层 为用户的应用进程提供网络服务
    + 表示层 数据编码 压缩解压缩、加密解密
    + 会话层 用户应用程序与网络之间的接口 负责在网络两个节点之间建立维护终止网络通信
    + 传输层 定义传输数据的协议端口号[把来自会话层的报文分割成数据段，构造协议数据单元，交给网络层传输]
    + 网络层
    + 数据链路层 将IP数据报加头加尾构成帧
    + 物理层 在物理介质上正确透明的传输比特流（由1、0转换成电流强弱传输，最后在转换回1、0）
- HTTP VS HTTPS
    + HTTP
        * 1.0/1.1/2.0

            特性\版本 | 1.0 | 1.1 | 2.0
            -|-|-|-
            长连接 | 需要使用keep-alive参数告知服务器建立长连接| 默认支持 | 默认支持
            多路复用 | x | 支持 | 支持且并发量更大
            HOST域 | x | o | o
            数据压缩 | x | x | 使用HPACK对header进行数据压缩
            服务端推送 | x | x | o 
        * HTTP请求种类
            - GET 请求指定信息 返回实体主体[参数长度限制](https://blog.csdn.net/qq_36707431/article/details/70050803)
            - HEAD 类似get请求 不返回实体主体 只返回请求头[可用于检测超链接是否可用/网页是否被修改]
            - POST 向指定资源提交数据进行处理请求（例如提交表单或者上传文件），数据被包含在请求体中
            - PUT 从客户端向服务端传送数据取代指定位置的资源 允许客户端查看服务器的性能
            - DELETE 请求删除指定资源
            - OPTIONS 返回服务器针对指定资源支持的请求方式
            - CONNECT http/1.1协议中预留给能够将链接改为管道方式的代理服务
            - TRACE 回显服务器收到的请求，主要用于测试或诊断[
                实现沿通向目标资源的路径的消息环回（loop-back）测试 ，提供了一种实用的 debug 机制。

                请求的最终接收者应当原样反射（reflect）它接收到的消息，除了以下字段部分，作为一个Content-Type 为 message/http  的200（OK）响应的消息的主体（body）返回给客户端 。

                最终接收者是指初始（origin）服务器，或者第一个接收到 Max-Forwards 值为 0的请求的服务器
            ]
        * 请求报文结构
            1. 请求行
                请求方法、url、http协议版本 （GET /xx/xx/xx.html http1.1）
            2. 请求头 (常见如下)
                - Accept 客户端支持的数据格式 或者说客户端希望收到的数据格式 但无论服务器返回什么结构 客户端都要接收 (eg: text/plain 文本阅读器 如果返回其他格式 则可能展示乱码)
                - Accept-charset 浏览器支持的编码格式 （gbk/utf-8) [以一个浏览器测试，当使用gbk编码返回字节流，地址栏http请求不会乱码但是ajax请求返回会乱码，说明解析页面默认使用gbk；ajax解析默认使用utf-8]
                - Accept-encoding 客户端支持的解码（解压缩）格式 （为了节省带宽 数据一般都会进行压缩 但是对用户透明 一般由服务器或代理完成）
                - Accept-language 客户端支持的语言格式
                - Referer 表示当前请求从哪个资源发起，或是请求的上一步地址
                    + 可以用于统计各个不同来源的访问量
                    + 防盗链 TODO:
                - If-Modified-Since 客户端缓存文件时间 (与之对应的是服务端返回的Last-Modified字段)
                    浏览器一般只对.html,.jpg,.css,.js等这些静态资源进行缓存，对于jsp页面以及ajax请求的动态结果，不缓存。服务器如Tomcat会自动给静态文件的响应报文添加“Last-Modified”字段，同时解析请求报文中的If-Modified-Since字段，这些都是对我们透明的。例如，我们将11.html改为11.jsp，那么浏览器将不会缓存页面内容，服务器每次都响应一个完整的页面内容给客户端，也不会在响应报文中添加“Last-Modified”字段
                - If-None-Match 作用同上 该值为资源文件的hash值 （第一次响应报文头中存在ETag,下次请求头中会加入If-None-Match）
                - Cache-control 控制客户端缓存机制 （public、private、no-cache、no- store、no-transform、must-revalidate、proxy-revalidate、max-age）TODO:
                - User-Agent 客户端相关信息
                - Host 主机地址+端口号/域名 [请求头Host](https://blog.csdn.net/netdxy/article/details/51195560)
                    (如果服务器后台解析出Host但是服务器上找不到相应的站点，那么这个连接很可能会被丢弃，从而报错，但是客户端还在等待) 同一ip对应多个域名 可以通过host区分

                - Content-length 接受报文的总长度 可以根据这个计算百分比 展示进度条
                - Authorization 授权信息
                - Pragma 仅用于客户端请求 Http1.1之前版本的遗留字段 标识所有中间服务器不可以返回缓存资源 如果所有中间服务器都支持Http1.1则可以直接使用Cache-control:no-cache 否则要同时使用Cache-control:no-cache Pragma:no-cache
                - From 请求首部 From 中包含一个电子邮箱地址,这个电子邮箱地址属于发送请求的用户代理的实际掌控者的人类用户
                - Range Range头可以请求实体的一个或者多个子范围
                - Connection 见下
            3. 空行 告知服务器 请求头到此结束
            4. 请求数据 get X post 提交数据
        * http响应报文结构
            1. 响应行   
                协议版本 状态码 描述 （HTTP 1.1 200 ok）
            2. 响应头
                - Content-Encoding
                - Content-Length
                - Content-Type 标识文档属于什么MIME类型 服务端默认为text/plain 一般需要改为text/html
                - Date 当前GMT时间
                - Expires 告诉浏览器缓存资源的过期时间 -1、0 不缓存
                - Last-Modified 上次修改时间 （浏览器下次请求携带If-Modified-Since查询资源是否过期 返回200/304）
                - Location 配合302使用 标识重定向到新的url
                    [重定向会向服务器发送两次请求，加重服务器负担。地址栏会变。完成购买这样的操作要重定向，而不要用转发，不然刷新就会又买一次，客户会愤怒]
                    ```js
                        // 这样，当请求服务器的时候可以重定向到这个/day20131128/1.html文件
                        response.setStatus(302);
                        response.setHeader("location","/day20131128/1.html");
                        //是上面两句的合成版。
                        response.sendRedirect("/day20131128/1.html");
                    ```
                - Accept-Ranges: （eg:  Accept-Ranges:bytes） - 该响应头表明服务器支持Range请求,以及服务器所支持的单位是字节(这也是唯一可用的单位).我们还能知道:服务器支持断点续传,以及支持同时下载文件的多个部分,也就是说下载工具可以利用范围请求加速下载该文件.Accept-Ranges: none 响应头表示服务器不支持范围请求
                - Refresh 服务器通知浏览器隔多长时间，刷新一次页面。比如聊天室。
                - Server 告知浏览器服务器的类型 （eg: nginx）
                - Set-Cookie 设置浏览器cookie
                
                * 缓存相关头字段优先级
                [Cache-Control/Expires/Last-Modified/ETag] TODO:
            3. 响应体 相应的消息体


- Http connection
    1. 短连接 short-lived connection http1.0 每个http请求都会进行tcp握手 tcp十分耗时[http1.1默认支持长连接，只有当connection为close时才会使用该方式]
    2. 长连接 Persistent connection http1.1默认支持 长连接会保持一段时间，节省tcp握手时间 但是也不会一直保持，可使用keep-alive设置最小保持时间[也有缺点：保持连接也会消耗服务器资源，而且容易造成Dos-attacks攻击]
    3. 流水线 HTTP pipelining 默认情况下 http请求顺序发出 下一次请求会在收到这次请求的应到后才会发出 可以利用两次请求在一个长连接上连续发出 不用等待应答 这样可能因为打到一个tcp包而优化性能

- 状态码
    + 1xx 此类状态代码表示请求已被接受并需要处理。这种类型的响应是一个临时响应，它只包含状态行和一些可选的响应头信息，并以空行结束。由于HTTP / 1.0协议中未定义1xx状态代码，因此服务器禁止向此类客户端发送1xx响应，除非在某些测试条件下
    + 2xx 成功接收并已完成整个处理过程
    + 3xx 重定向
        * 301 永久移动
        * 302 临时移动
        * 304 自从上次请求 资源未修改
        * 305 访问者应使用代理请求
        * 307 POST请求的重定向？
    + 4xx 客户端错误
        * 403 服务器拒绝 权限不够
        * 404 服务器找不到请求资源
    + 5xx 服务端错误
        * 500 服务器内部错误 无法完成请求
        * 502 服务器作为网关和代理错误
        * 504 网关超时

- HTTPS
    HTTP + SSL 在传输层和应用层之间对数据进行加密
    SSL 安全套接层 TLS 传输层安全
    [图解SSL/TLS](http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)
    1. Client ---------随机数C1,加密算法func-------------------> Server
    2. Client <--------确认加密算法,数字证书(认证取得公钥),随机数--- SServer
    3. Client ---------随机数C2,公钥加密C2---------------------> Server
    4. Server私钥解密C2
    5. Client/Server使用func(C1,C2,S)加密生成SessionKey [后续使用对称加密]

- 客户端如何验证证书合法性
    1. 先确认证书有效期，校验证书的网站域名与证书的颁发域名是否一致
    2. 确认证书中的颁发机构CA与系统颁发机构CA进行对比
    3. 如果没有 说明证书不可信
    4. 如果有 取出其中的公钥 对签名进行解密
    5. 使用同样的hash算法计算证书hash值与签名进行对比 确认合法性

- 对称加密与非对称加密
    + 对称加密：加密和解密使用的密钥是同一个。DES、AES

    + 非对称加密：加密和解密使用的不同的密钥。RSA

    + 摘要算法：MD5，SHA，hash算法不可逆
- 中间人攻击
    [客户端:C;服务器:S;中间人:A]
    0. C发起访问请求,A拦截并向S发起访问请求
    1. S向C发送公钥
    2. A截获公钥PubKey,生成假的公钥发送给C
    3. C使用假的公钥加密[会话秘钥Key]
    4. A收到后使用自己的私钥解密得到会话秘钥Key
    5. A用PubKey加密[假的会话秘钥Key2]传给服务器
    6. 服务器使用自己的私钥解密得到Key2

    + 解决: 在公钥中加入认证机构颁发的CA证书
- TCP/UDP
    * TCP 传输控制协议 提供面向连接、点到点、可靠的通信
    * UDP 用户数据报协议 提供非连接、点到多点、不可靠通信 由于不需要进行数据确认 传输效率更高
    * 区别
        [link](https://zhuanlan.zhihu.com/p/24860273)
        [面试头条你需要懂的 TCP 拥塞控制原理**](https://zhuanlan.zhihu.com/p/76023663)
        区别点 | TCP | UDP
        -|-|-
        连接性 | - | -
        可靠性 | - | -
        传输内容 | 字节流 | 报文段
        传输效率 | 一般 | 高于TCP
        流量控制 | 有(滑动窗口) | 无
        拥塞控制 | 有(慢启动、拥塞避免、快重传、快恢复) | 无
        首部 | 最小20、最大60 | 8字节
        顺序 | 按照先后顺序 | 无法保证
    * TCP三次握手/四次挥手
        [link](https://www.jianshu.com/p/eb50d2152646)
        1. 三次握手
            + TCP规定，SYN报文不携带数据，但是需要消耗序号
            + TCP规定，ACK可以携带数据，不携带数据则不消耗序
            ------
            1. Client ----------------SYN=1 seq=J--------------> Server
            2. Client <--------SYN=1 ACK=1 seq=K ack=J+1-------- Server
            3. Client -----------SYN=1 seq=K+1 ack=K+1---------> Server
        2. 四次挥手
            + TCP规定，FIN报文不携带数据，但是需要消耗序号
            ------
            1. Client ----------FIN=1 seq=u------------> Server
            2. Client <---------ACK=1 seq=v ack=u+1----  Server
            3. (Client <---------transferring------------ Server)
            4. Client <----FIN=1 ACK=1 seq=w/(v+1?) ack=u+1--- Server
            5. Client -----ACK=1 seq=u+1 ack=w+1-------> Server
        3. 为什么需要四次挥手
            - 步骤1结束后，服务器进入FIN-WAIT-1等待状态，步骤1+2只是表示客户端方向已经结束了数据传输，但是服务器端可能还需要继续传输给数据，而且客户端必须接收，因此2结束后，客户端进入FIN-WAIT-2等待状态，服务器如果有数据，可以继续传输，传输结束后，服务器发起传输结束标识，客户端接收该结束标识并等待2MSL的时间后，结束该次TCP连接，服务端则是在接收到客户端发送的最后一次请求后便立刻结束当次TCP连接（因此TCP更早结束）
        4. 为什么需要等待2MSL时间后客户端再结束
            [MSL:报文最长寿命，最大生存时间]
            - 由于最后一次客户端反馈的接收结束消息可能丢失，导致服务器一直等待，因此客户端等待2MSL时间还没有收到服务器重传的上一个消息，即表示服务器正常收到了结束通知，才可以结束
            - 等待2MSL时间后，当次连接网络上的所有消息都失效，不会在下次TCP连接中收到旧的包

    * UDP 使用场景
        + ping命令就是发送数据包？？？
        + 对实时性要求比较高 如直播 若使用TCP 发生超时重传时 可能会有明显卡顿 还有堆积过多的可能 采用UDP 即使丢失几个包 影响也不大
        + 多点通信
    * TCP拥塞控制
        目标：最大化利用网络上瓶颈链路的带宽
        + 水管内的水的数量 = 水管的容积 = 水管粗细 × 水管长度
        + 网络内尚未被确认收到的数据包数量 = 网络链路上能容纳的数据包数量 = 链路带宽 × 往返延迟
        + TCP维护一个拥塞窗口(cwdn),用来估计一段时间内该链路上可以承载和传输的数据量 拥塞窗口的大小取决于网络的拥塞程度 在不断变化[只要网络中没有出现拥塞，拥塞窗口的值就可以再增大一些，以便把更多的数据包发送出去，但只要网络出现拥塞，拥塞窗口的值就应该减小一些，以减少注入到网络中的数据包数]
        + 常见拥塞控制算法：
            * Reno(基于丢包)(详细可见图解./TCP-3次ACK确认)
                0. cwdn: 拥塞窗口(字节为单位) ssthresh: 慢启动阈值 RTO: 重传定时器
                1. 慢启动
                    cwdn从1开始，指数型增长，1.2.4.8...，每轮次增加发送拥塞窗口，直到出现丢包(判断依据可为：没有收到确认数据包)，则此时的cwdn为初始ssthresh，并将cwdn降为当前的一半，开始进入拥塞避免阶段
                2. 拥塞避免
                    进入拥塞避免阶段开始线性增长，每次增加1，直到出现接收同一个数据包的三次确认(标识他的下一个数据包没有被接收端收到)，进入快重传阶段
                3. 快重传
                    立即重传接收到三次确认ACK包的下一个数据包，而不等待重传计时器
                4. 快恢复
                    重传结束后，此时的cwdn为新的ssthresh，降cwdn为现在的一半，重新开始拥塞避免阶段重复此过程
                -----
                - cwdn < ssthresh: 慢启动;
                  cwdn > ssthresh: 拥塞避免;
                  cwdn > ssthresh: 任意
            * BBR
                不使用丢包或延时作为拥塞信号，而是认为当(网络上数据包总量) > (瓶颈链路带宽*延时) -> 出现拥塞，因此BBR也称为[基于拥塞的拥塞控制算法]
                > BBR 算法周期性地探测网络的容量，交替测量一段时间内的带宽极大值和时延极小值，将其乘积作为作为拥塞窗口大小，使得拥塞窗口始的值始终与网络的容量保持一致

                > 所以 BBR 算法解决了两个比较主要的问题：
                    1. 在有一定丢包率的网络链路上充分利用带宽。
                    适合高延迟、高带宽的网络链路。
                    2. 降低网络链路上的 buffer 占用率，从而降低延迟。
                    适合慢速接入网络的用户
            * Reno VS BBR (见图./TCP拥塞控制Reno&&BBR)
                Reno: 适用于低带宽低延时网络
                BBR: 适用于高带宽高延时网络
    * TCP超时重传
    * TCP流量控制
    * TCP首部长度，有哪些字段
        [TCP超详细](https://zhuanlan.zhihu.com/p/88621517)
        ----------------32bit/4Byte----------------
        源端口 | 目的端口
        序号(当前包在整个报文的偏移位)
        确认序号(ACK=1才有效)
        数据偏移 | 保留位(000000) | 6位标志位 | 窗口
        校验和 | 紧急指针 (到这里为20字节)
        选项和填充
    * 为什么建立连接需要三次握手，而断开连接需要四次握手
    * 标识位
        URG URG=1 标识数据包应该尽快传递
        ACK ACK=1 确认序号才有效
        PSH PSH=1 数据包应该尽快送至应用层
        RST RST=1 连接错误应该释放连接并重新连接 或者可以标识拒绝不法报文或连接申请
        SYN SYN=1/ACK=0 连接请求
        FIN 发端完成发送任务
- 转发与重定向
    [link](https://www.cnblogs.com/fifiyong/p/5949689.html)
    + 转发是服务器端行为，将请求转到同web下其他url
    + 重定向是服务器返回302给用户并告知新的url 浏览器地址栏变更 回退按钮会点亮 用户再次发起请求[至少发起两次请求]
- 缓存

- 跨域
    1. cors
    2. nginx反向代理
    3. node代理
    4. window.name+iframe [postMessage]
    5. jsonp （只支持get方法）[<script src="http://jsonp.js?callback=xxx"></script>]
        ```js
            // 简单jsonp-1
            function jsonp(req){
                var script = document.createElement('script');
                var url = req.url + '?callback=' + req.callback.name;
                script.src = url;
                document.getElementsByTagName('head')[0].appendChild(script); 
            }

            // node
            var http = require('http');
            var urllib = require('url');

            var port = 8080;
            var data = {'data':'world'};

            http.createServer(function(req,res){
                var params = urllib.parse(req.url,true);
                if(params.query.callback){
                    console.log(params.query.callback);
                    //jsonp
                    var str = params.query.callback + '(' + JSON.stringify(data) + ')';
                    res.end(str);
                } else {
                    res.end();
                }
                
            }).listen(port,function(){
                console.log('jsonp server is on');
            });

            // promise jsonp-2
            function jsonp({url, params, callback}) {
                return new Promise((resolve, reject) => {
                    let script = document.createElement('script');
                    window[callback] = function(data) {
                        resolve(data);
                        document.body.removeChild(script);
                    }
                    params = {...params, callback}
                    let arrs = [];
                    for (let key in params) {
                        arrs.push(`${key}=${params[key]}`);
                    }
                    script.src = `${url}?${arrs.join('&')}`;
                    document.body.appendChild(script);
                });
            }
            function show(data) {
                console.log(data);
            }
            jsonp({
                url: 'xxxx',
                params: {
                    // ...
                },
                callback: 'show'
            }).then(data => {
                console.log(data);
            })

        ```

- 手写ajax
    ```js
        var xhr;
        var url = '/query';
        var postData = JSON.stringify({a:1,b:2});
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // success;
            } else {
                // some error
            }
        }
        xhr.open('POST', url, true);
        // xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
        // xhr.withCredentials = true;  // 携带跨域cookie
        xhr.send(postData);

        // +promise
        function _xhr() {
            return new Promise(function (resolve, reject) {
                xhr.open(method, url, async)
                xhr.onloadend = function() {
                    if (xhr.status === 200) {
                        resolve(xhr)
                    } else {
                        reject({
                            errorType: 'status',
                            xhr: xhr
                        })
                    }
                }
                xhr.ontimeout = function() {
                    reject({
                        errorType: 'timeout',
                        xhr: xhr
                    })
                }
                xhr.onerror = function() {
                    reject({
                        errorType: 'error',
                        xhr: xhr
                    })
                }
                xhr.onabort = function() {
                    reject({
                        errorType: 'abort',
                        xhr: xhr
                    })
                }
                try {
                    xhr.send(data)
                } catch (error) {
                    reject({
                        errorType: 'send',
                        error: error
                    })
                }
            })
        }
    ```
- XSS/CSRF
    [前端安全：XSS与CSRF](https://zhuanlan.zhihu.com/p/31553667)
    + XSS[Cross Site Scripting跨站脚本攻击] 
        * 恶意攻击者将可执行js代码提交到服务器 然后在其他用户端执行
        现代MVVM框架，ng2、vue、handlebars中都自带防XSS攻击模板写法(eg: handlebars中的{{}}表示自动过滤,{{{}}}才会不经转义直接输出)
        * 需要注意，不仅是script标签可以加入可执行代码，任何dom节点都可以增加onClick/onload事件
        * 网站建设方的防护手段
            1. 转义 &lt; &gt; 这些特殊字符为实体字符
            2. 利用正则判断攻击脚本
            3. 尽量修改节点文本而不是修改节点内容html

    + CSRF[Cross-site request forgery跨站请求伪造]
        * 恶意用户将某些需要他人权限的接口埋藏在自己的代码中，通过比如XSS攻击方式，或诱导用户点击等令拥有权限者执行从而达到自己的目的
        * 网站建设方的防护手段
            1. 尽量对要修改数据的请求使用post而不是get
            2. 给每一次用户登陆分配一个临时token，用服务端的setCookie头将此token种入用户cookie中，每次请求比对用户方token与服务器端token是否吻合。
            3. 服务器禁止跨域请求
            4. 及时清除用户的无效cookie
    + 补充：
        * SSRF(Server-Side Request Forgery:服务器端请求伪造) 
            > 是一种由攻击者构造形成由服务端发起请求的一个安全漏洞。一般情况下，SSRF攻击的目标是从外网无法访问的内部系统。（正是因为它是由服务端发起的，所以它能够请求到与它相连而与外网隔离的内部系统）

            > SSRF 形成的原因大都是由于服务端提供了从其他服务器应用获取数据的功能且没有对目标地址做过滤与限制。比如从指定URL地址获取网页文本内容，加载指定地址的图片，下载等等。

            > 修复方式: 1.设置URL白名单或者限制内网IP
                2.统一错误信息，避免用户可以根据错误信息来判断远端服务器的端口状态。

- 从输入URL到显示页面发生了什么[TODO:浏览器渲染流程]
    1. url解析
    2. DNS查询
    3. TCP链接发起
    4. 服务端处理请求
    5. 客户端接受响应并对响应资源进行处理
    6. 页面渲染
    7. JS代码执行

- script中的defer/async
    + 没有defer/async会阻碍后续文档的加载
    + defer 同时加载文档流并等待到DOMContentLoaded之后（window.onload之前）执行
    + async 同时加载文档流并在js资源加载回来后就开始执行
- 浏览器事件三个阶段
    + 捕获
    + 到达
    + 冒泡
    -----
    + addEventListener第三个参数：
        * false 冒泡阶段执行（默认值）
        * true 捕获阶段执行
- 正向代理反向代理
    [link](https://www.cnblogs.com/Anker/p/6056540.html)
    + 正向代理
        1. 访问无法访问的资源 如翻墙google
        2. 缓存 如cdn
        3. 对客户代理授权、上网认证
        4. 对用户访问行为记录（网络管理）、隐藏用户行为
    + 反向代理
        1. 利用WAF保证内网的安全性
        2. 负载均衡
    + 总结二者的区别宏观上为：
        1. 正向代理中，代理与用户端处于同一个LAN，对服务端透明
        2. 反向代理中, 代理与服务器处于同一个LAN，对用户透明
- 进程/线程
    “进程是资源分配的最小单位，线城市CPU调度的最小单位”
    一个程序至少一个进程，一个进程至少一个线程
- 有哪些协议是基于 TCP 的，哪些是基于 UDP 的
    + UDP
        1. DHCP[动态主机配置协议]
            > 是一个局域网的网络协议，该协议允许服务器向客户端动态分配 IP 地址和配置信息。 使用UDP协议工作， 主要有两个用途：(1)给内部网络或网络服务供应商自动分配IP地址，(2)给用户或者内部网络管理员作为对所有计算机作中央管理的手段
        2. NTP[网络时间协议]
            > 是用来使计算机时间同步化的一种协议，它可以使计算机对其服务器或时钟源（如石英钟，GPS等等)做同步化，它可以提供高精准度的时间校正（LAN上与标准间差小于1毫秒，WAN上几十毫秒），且可介由加密确认的方式来防止恶毒的协议攻击
        3. BOOTP[引导程序协议]
            > DHCP协议的前身，用于无盘工作站从中心服务器上获取IP地址
    + TCP
        1. HTTP
        2. HTTPS
        3. FTP 文件传输协议
        4. POP3 收取邮件
        5. SMTP 发送邮件(建立在FTP 默认端口25，SSL加密后465) 是一个“推”协议，不允许拉
        6. Telnet 远程登录协议
        7. SSH 安全外壳协议，用于加密安全登陆，替代安全性差的Telnet协议
[TCP常见问题](https://zhuanlan.zhihu.com/p/88621517)
[UDP首部字段](https://zhuanlan.zhihu.com/p/94415455)
- 三次握手过程中有哪些不安全性
[三次握手过程中有哪些不安全性](https://www.cnblogs.com/taoshihan/p/11215329.html)
- HTTP劫持 && DNS劫持
    [http劫持](https://zhuanlan.zhihu.com/p/31344484)
    + http劫持 劫持请求并篡改响应内容
    + dns劫持 修改域名对应的ip地址
- JSONP跨域
    [link](https://segmentfault.com/a/1190000007665361?utm_source=tag-newest)
- Transfer-Encoding (https://imququ.com/post/transfer-encoding-header-in-http.html)




