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
                - Host 主机地址+端口号
                - Content-length 接受报文的总长度 可以根据这个计算百分比 展示进度条
                - 

            3. 空行
            4. 请求数据
