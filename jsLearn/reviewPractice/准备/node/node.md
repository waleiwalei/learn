#### Buffer
- Buffer 二进制流
- 字符串转Buffer
    new Buffer([str], [encoding])
- Buffer转字符串
    buf.toString([encoding], [start], [end])
- 静态资源可以使用先转为buffer再传输，这样可以提高服务端的qps和传输速度
- Buffer乱码
    ```js
    fs = require('fs').createReadStream('test.md', {highWaterMark: 11})

    var data = '';
    fs.on('data', (chunk) => {
        data += chunk;
    })
    fs.on('end', () => {
        // 对于中文来说，每个字占3个字节，11/3...2后两个字节无法正常处理
        console.log(data);
    })
    ```
- 使用setEncoding设置编码可以解决一部分问题
    fs.setEncoding('utf8');
    内部将最后两个字符和下一次的第一个字符拼接后解析
- 最正确拼接
    ```js
    fs = require('fs').createReadStream('test.md', {highWaterMark: 11})

    var data = [];
    var size = 0;
    fs.on('data', (chunk) => {
        data.push(chunk);
        size += chunk.length;
    })
    fs.on('end', () => {
        // 生成buffer
        var buf = Buffer.concat(data, size);
        // iconv 打开一个编码转换流
        var str = iconv.decode(buf, 'utf8');
        console.log(str);
    })
    ```
### 进程
- 多进程
    + 创建子进程 child_process
        * spawn() 启动子进程执行命令
        * exec() 启动子进程执行命令，并且有一个回调可以获取子进程状态
        * execFile() 启动子进程执行可执行文件 如果是js文件 头部必须有
        #!usr/bin/env node
        * fork() 启动子进程执行js文件
    + 对比

    类型| spawn | exec | execFile | fork
    -|-|-|-|-
    回调 | - |ok|ok|-
    进程类型|任意|任意|任意|node
    执行类型|命令|命令|可执行文件|js文件
    超时|-|ok|ok|-
- 父子进程通信 IPC node中实现是采用管道 在node中IPC被抽象为stream对象
    ```js
    // master
    var child_process = require('child_process');
    var child = child_process.fork(__dirname + '/sub.js');

    child.on('message', (msg)=>{

    })
    child.send({name: 1})
    // worker
    process.on('message', (msg) => {})
    process.send({data: 2})
    ```
- EADDRINUSE 端口被占用
- 句柄传递：
- 监听同一端口的多个子进程
    + 方法1 让父进程监听80 多个子进程分别再监听8001、8002... 让父进程做代理
        劣势：进程接到连接后需要用掉一个文件描述符，这样会每次用调两个文件描述符，系统文件描述符有限
    + 方法2 用send方法发送句柄「标识资源引用，如服务端socket、客户端socket、UDP套接字、管道等」
        > 这样传递句柄使得多个子进程坚挺的socket套接字文件描述符相同，因此不会向不同子进程直接监听同一个端口导致端口被占用问题
        ```js
        // demo-01
        // 这段代码访问8888，父子进程都可能受到请求，处理请求
        var child = require('child_process').fork('./child.js');
        var server = require('net').createServer();
        server.on('connection', (socket) => {
            socket.end('parent end');
        })
        server.listen(8888, () => {
            // 直接发送TCP服务器
            child.send('s', server);
        })

        // 子进程
        process.on('message', (m, server) => {
            if(m == 's') {
                server.on('connection', (socket) => {
                    socket.end('child end');
                })
            }
        })


        // demo-02 父进程传递句柄后关闭连接
        var child1 = require('child_process').fork('./child.js');
        var child2 = require('child_process').fork('./child.js');
        var server = require('net').createServer();
        server.listen(8888, () => {
            // 直接发送TCP服务器
            child1.send('s', server);
            child2.send('s', server);
            server.close();
        })

        // 子进程
        var http = require('http');
        var worker = http.createServer((req, res) => {
            res.setHeader(200, {'Content-Type': 'text/plain'});
            res.end('child end');
        })
        process.on('message', (m, server) => {
            if(m == 's') {
                server.on('connection', (socket) => {
                    worker.emit('connection', socket);
                })
            }
        })
        ```
- 进程重启
    ```js
    var server = require('net').createServer();
    var fork = require('child_process').fork;
    var cpus = require('os').cpus().length;
    server.listen(8888);
    var workers = {};

    function createWorker() {
        var worker = fork(__dirname + '/worker.js');

        worker.on('exit', () => {
            delete workers[worker.pid];
            createWorker();
        })

        worker.send('server', server);
        workers[worker.pid] = worker;
    }

    for(var i = 0; i < cpus; i ++) {
        createWorker();
    }

    // 主进程退出，所有进程退出
    process.on('exit', () => {
        for(var pid in workers) {
            workers[pid].kill();
        }
    })



    // 子进程要增加未捕获异常的监控
    process.on('unCaughtException', () => {
        process.send({act: 'suicide'});
        worker.close(() => {
            process.exit(1);
        })
    });
    // 主进程监听suicide
    worker.on('message', (msg) => {
        if(msg.act == 'suicide') {
            createWorker();
        }
    })
    ```
- 限量重启
    
