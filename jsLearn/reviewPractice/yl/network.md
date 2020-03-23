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
- TCP三次握手/四次挥手




