const fork = require('child_process').fork;
const net = require('net');

// 主进程创建的tcp Server
const server = net.createServer();
server.listen(8099)

const worker = fork('./worker.js');
worker.send('server', server);
console.log('master process working,', process.pid);

process.exit(0);