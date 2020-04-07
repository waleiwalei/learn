### node标榜“异步IO/事件驱动/单线程”
- 多核环境单线程无法最大化利用CPU
- 一旦报错没有捕获 整个线程退出
#### 目录
- 线程与进程
- node多进程引入背景
- 基本结构
- 实现
    + 父子进程
    + 多个子进程端口
    + 进程间通信IPC
    + 守护进程
- cluster

#### 进程与线程
- 进程的概念
    > 进程（Process）是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础
- 线程的概念
    > 线程（thread）是操作系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单位。
- 区别:
    每个进程有自己的调度资源，执行栈；一个进程中可能有单个或多个线程，这些线程之间共享资源。
- 
    早期单核系统中为了能够使用分时轮询机制，宏观上增加同事运行程序个数，引入多进程模式；但是由于多进程之间切换时，需要切换进程控制块信息及硬件现场等，造成系统开销较大；多个线程的引入，由于共享进程资源，因此所需系统开销较小。
#### node多进程引入背景
    nodejs最初的理念是：异步I/O非阻塞与事件驱动。但是由于node集成了js单线程的特性，因此当线程内出现耗时的同步操作时，或者当执行过程中出现异常，整个服务将处于不可用状态；为了提高node服务的系统吞吐量（完成的作业数/单位时间），引入node多进程
#### 基本结构
            ——————————————————
           |    Nodejs主进程    |
           |   ————————————    |
           |  |  Nodejs线程 |   |
           |   —————————————   |
            ——————————————————
                /    |    \
               /     |     \
              /      |      \
 ——————————————————
|    Nodejs子进程   |
|   ————————————   |   ................
|  |  Nodejs线程 |  |
|   —————————————  |
——————————————————
**注** 图片见'./多进程.jpg'
#### 实现
- 父子进程 
    > 见demo
    ```js
    /** master.js */
    const fork = require('child_process').fork;
    const net = require('net');

    const server = net.createServer();
    server.listen(8090);

    const worker = fork('./child1.js');
    worker.send('server', server);
    ```

    ```js
    /** child1.js */
    const http = require('http');
    const worker = ttp.createServer((req, res)=>{
        // ppid在node指定版本才引入 低版本可能为undefined
        console.log(process.pid, process.ppid);
    });

    process.on('message', (type, tcp)=>{
        if(type==='server') {
            // connection是在新的链接建立时触发
            tcp.on('connection', (socket)=>{
                worker.emit('connection', socket);
            })
        }
    })
    ```
- 进程间通信IPC
    如上例，父子进程间通过传递一个在父进程中创建的server,让子进程拿到这个server后，在子进程中监听，当监听到connection时，作出响应。

    **注**
    [这是参考文章中的一段解释]当父子进程之间建立 IPC 通道之后，通过子进程对象的 send 方法发送消息，第二个参数 sendHandle 就是句柄，可以是 TCP套接字、TCP服务器、UDP套接字等，为了解决上面多进程端口占用问题，我们将主进程的 socket 传递到子进程
- 多个子进程端口
    多个子进程之间由于通过IPC进行通信，因此多个子进程之间实际上是一种抢占式机制，请求到达时，只有一个子进程可以相应。
- 守护进程
    简单实例见demo2
#### cluster


[参考]
1. https://www.imooc.com/article/288056#Interview6
2. https://zhuanlan.zhihu.com/p/42820028
3. https://zhuanlan.zhihu.com/p/100550801