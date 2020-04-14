const http = require('http');

const server = http.createServer((req, res) => {
    // res.writeHead(200, {
    //     'Content-Type': 'text/plain'
    // });
    res.end(Date.now()+', at pid: ' + process.pid);
});

process.on('message', (type, tcp) => {
    if (type==='server') {
        tcp.on('connection', socket => {
            server.emit('connection', socket)
        })
    }
})