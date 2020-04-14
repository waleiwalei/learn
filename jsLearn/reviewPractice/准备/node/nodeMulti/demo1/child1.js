const http = require('http');

const server = http.createServer((req, res) => {
    // res.writeHead(200, {
    //     'Content-Type': 'text/plain'
    // });
    res.end(Math.random()+', at pid: ' + process.pid);
});

// message事件: IPC通道衍生的node进程,在父进程通过[childProcess].send传递消息时会触发
process.on('message', (type, tcp) => {
    if (type==='server') {
        // connection 当一个新的链接建立时触发
        tcp.on('connection', socket => {
            server.emit('connection', socket)
        })
    }
})