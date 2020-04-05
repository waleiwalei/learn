### nginx反向代理、负载均衡
- 反向代理
    + 将请求域名对应的地址映射到nginx服务器，然后经过路由匹配等处理操作后，再转发到真实服务器
    + 以代理服务器接受网络请求，将请求转发到内部服务器
    + nginx的优势是异步阻塞，可以同时处理维护多个请求，后端服务器只需要逻辑计算，节约等待时间处理更多请求
    + [为什么nginx做反向代理可以提高服务器性能](https://www.zhihu.com/question/19761434)
    ```js
    // 简单demo
    location /some/path/ {
        proxy_pass http://www.example.com/link/;
    }

    // 真实应用场景
    upstream baidunode {
        server 172.25.0.105:8081 weight=10 max_fails=3     fail_timeout=30s;
    }
    location / {
        add_header Cache-Control no-cache;
        // Host 设置请求Host 防止因防盗链导致请求失败
        proxy_set_header   Host local.baidu.com;
        // X-Forwarded-For 请求发起方 如果不设置 后端服务器会认为请求都是ng发起的 如果服务器有防攻击策略，ng代理服务器的ip会可能被封掉
        // 这条配置是增加$proxy_add_x_forwarded_for到X-Forwarded-For中
        // X-Forwarded-For的格式为X-Forwarded-For:real client ip, proxy ip 1, proxy ip N，每经过一个反向代理就在请求头X-Forwarded-For后追加反向代理IP
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_pass         http://baidunode;
        // nginx服务器与被代理的服务器建立连接的超时时间，默认60秒
        proxy_connect_timeout 30s;
    }
    ```
    + X-Forwarded-For 一般用于经过代理服务器时记录请求路径
        * 每经过一个代理服务器，就会在X-Forwarded-For中追加一个请求来源IP的信息
    + X-Real-IP 一个自定义的头信息
        * 如果只经过一个代理服务器 二者就相同
    + Client(1.1.1.1) -> 代理(2.2.2.2) -> 代理(3.3.3.3) -> 代理(4.4.4.4) -> Server
        * Server收到的请求头中X-Forwarded-For为1.1.1.1 2.2.2.2 3.3.3.3
        * X-Real-IP 不一定 要看实际代理的类型（正向还是反向）
- 负载均衡
    + DNS轮询实现简单负载均衡
        * 缺点
            1. 可靠性低
                > 假设轮询过程中有一台服务器故障，那么所有访问该服务器的请求都将不会在有所回应。即使从DNS中把这个故障的服务器IP去除，他也需要一些时间才能生效。
            2. 负载分配不均衡
                > DNS负载均衡采用的是最简单的轮询负载算法，不能区分服务器的当前运行状态，不能做到配置高的服务器多分配请求，配置低的少分配，甚至可能所有请求集中在某一台上。DNS服务器是按照一定的层次结构组织的，本地DNS服务器会缓冲已解析的域名到IP地址的映射，这会导致该DNS服务器的用户在一段时间内访问的是同一台web服务器，导致负载不均衡

    + nginx代理的几种配置负载均衡方式
        * 常见配置参数
            1. weight：服务器的权重，权重数值越高，被分配的客户端请求数越多，默认为1
            2. max_fails：在参数fail_timeout指定的时间内对后端服务器请求失败的次数，如果检测到后端服务器无法连接或者发生错误(404错误除外)，则标记为失败，如果没有设置，默认为1，设为0将关闭这项检查。
            3. fail_timeout：在经历参数max_fails设置的失败次数后，暂停的时间。
            4. down：标记服务器为永久离线状态，用于ip_hash指令。
            5. backup：仅仅在非backup服务器全部宕机或者繁忙的时候才启用
        ```js
        // 热备
        upstream mysvr { 
            server 127.0.0.1:7878; 
            server 192.168.10.121:3333 backup;  #热备     
        }
        // 轮询 默认权重1
        upstream mysvr { 
            server 127.0.0.1:7878;
            server 192.168.10.121:3333;       
        }
        // 加权轮询 根据权重分给不同服务器不同请求数量
        upstream mysvr { 
            server 127.0.0.1:7878 weight=1;
            server 192.168.10.121:3333 weight=2;
        }
        // ip_hash 对同一个客户端ip进行hash 相同hash值请求由同一服务器处理 解决session不共享的问题
        // ip_hash 使得不会出现访问A服务器登陆后访问B导致的登录失效问题
        // 但是！使用ip_hash指令无法保证后端服务器的负载均衡，可能有些后端服务器接受的请求多，有的少，并且设置服务器权重登方法将不起作用，所以如果后端能做到session共享，不建议使用ip_hash方式
        upstream mysvr { 
            server 127.0.0.1:7878; 
            server 192.168.10.121:3333;
            ip_hash;
        }

        // location处理路由进行转发
        location {
            // mysvr: upstream的名字
            proxy_pass mysvr;
        }
        ```
- nginx常用命令
    +  启动
        * nginx -s start;
    + 重新启动，热启动，修改配置重启不影响线上
        * nginx -s reload;
    + 关闭
        * nginx -s stop;
    + 修改配置后，可以通过下面的命令测试是否有语法错误
        * nginx -t;
- nginx配置 [更多内容看这里(nginx系列123)](https://www.jianshu.com/p/734ef8e5a712)
    + 整体
    ```js
        // 全局模块
        events {
            // events模块
            // 配置影响nginx服务器或与用户的网络连接
        }

        http 
        {

        // http全局模块
        
            server 
            {
            
                // server全局模块 虚拟主机相关内容
            
                location [PATTERN]{
                // location模块 路由、页面相关
                }
            }

        } 
    ```
    + 示例配置
    ```js
        ########### 每个指令必须有分号结束。#################
        #user administrator administrators;  #配置用户或者组，默认为nobody nobody。
        #worker_processes 2;  #允许生成的进程数，默认为1
        #pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
        error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
        events {
            accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
            multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
            #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
            worker_connections  1024;    #最大连接数，默认为512
        }
        http {
            include       mime.types;   #文件扩展名与文件类型映射表
            default_type  application/octet-stream; #默认文件类型，默认为text/plain
            #access_log off; #取消服务日志    
            log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
            access_log log/access.log myFormat;  #combined为日志格式的默认值
            sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
            sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
            keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

            upstream mysvr {   
            server 127.0.0.1:7878;
            server 192.168.10.121:3333 backup;  #热备
            }
            error_page 404 https://www.baidu.com; #错误页    
            server {
                keepalive_requests 120; #单连接请求上限次数。
                listen       4545;   #监听端口
                server_name  127.0.0.1;   #监听地址       
                location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
                #root path;  #根目录
                #index vv.txt;  #设置默认页
                proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
                deny 127.0.0.1;  #拒绝的ip
                allow 172.18.5.54; #允许的ip           
                } 
            }
        } 
    ```
    + location 匹配优先级
        ```js
            location = / {
                # 完全匹配  =
                # 大小写敏感 ~
                # 忽略大小写 ~*
            }
            location ^~ /images/ {
                # 前半部分匹配 ^~
                # 匹配任何以 /images/ 开头的地址，匹配符合以后，停止往下搜索正则，采用这一条。
            }
            location ~* \.(gif|jpg|jpeg)$ {
                # ~* 表示执行一个正则匹配，不区分大小写
                # ~ 表示执行一个正则匹配，区分大小写
                # 匹配所有以 gif,jpg或jpeg 结尾的请求
            }
            location / {
                # 如果以上都未匹配，会进入这里
            }
        ```
        * 总结： (location =) > (location 完整路径) > (location ^~ 路径) > (location ,* 正则顺序) > (location 部分起始路径) > (/)
        ```js
            location = / {
                #仅仅匹配请求
                [ configuration A ]
            }
            location / {
                #匹配所有以 / 开头的请求。但是如果有更长的同类型的表达式，则选择更长的表达式。如果有正则表达式可以匹配，则优先匹配正则表达式。
                [ configuration B ]
            }
            location /documents/ {
                # 匹配所有以 /documents/ 开头的请求。但是如果有更长的同类型的表达式，则选择更长的表达式。
                #如果有正则表达式可以匹配，则优先匹配正则表达式。
                [ configuration C ]
            }
            location ^~ /images/ {
                # 匹配所有以 /images/ 开头的表达式，如果匹配成功，则停止匹配查找。所以，即便有符合的正则表达式location，也
                # 不会被使用
                [ configuration D ]
            }
            location ~* \.(gif|jpg|jpeg)$ {
                # 匹配所有以 gif jpg jpeg结尾的请求。但是 以 /images/开头的请求，将使用 Configuration D
                [ configuration E ]
            }
        ```

    + 内置的全局变量
        ```js
        $args ：这个变量等于请求行中的参数，同$query_string
        $content_length ： 请求头中的Content-length字段。
        $content_type ： 请求头中的Content-Type字段。
        $document_root ： 当前请求在root指令中指定的值。
        $host ： 请求主机头字段，否则为服务器名称。
        $http_user_agent ： 客户端agent信息
        $http_cookie ： 客户端cookie信息
        $limit_rate ： 这个变量可以限制连接速率。
        $request_method ： 客户端请求的动作，通常为GET或POST。
        $remote_addr ： 客户端的IP地址。
        $remote_port ： 客户端的端口。
        $remote_user ： 已经经过Auth Basic Module验证的用户名。
        $request_filename ： 当前请求的文件路径，由root或alias指令与URI请求生成。
        $scheme ： HTTP方法（如http，https）。
        $server_protocol ： 请求使用的协议，通常是HTTP/1.0或HTTP/1.1。
        $server_addr ： 服务器地址，在完成一次系统调用后可以确定这个值。
        $server_name ： 服务器名称。
        $server_port ： 请求到达服务器的端口号。
        $request_uri ： 包含请求参数的原始URI，不包含主机名，如：”/foo/bar.php?arg=baz”。
        $uri ： 不带请求参数的当前URI，$uri不包含主机名，如”/foo/bar.html”。
        $document_uri ： 与$uri相同。
        ```
    + echo模块 是在nginx程序上扩展了echo输出字符的功能, 对于调试很方便
