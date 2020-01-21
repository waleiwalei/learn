/** 
 * 多进程守护 每次杀死进程就创建一个进程
*/
const fork = require('child_process').fork;
const net = require('net');
const os = require('os');

const createServer = () => {
    const server = net.createServer();
    const childPr = fork('./httpServer.js');
    childPr.on('exit', () => {
        console.log('worker exit: ' + childPr.pid);
        createServer();
    })
    childPr.send('server', server);
    console.log('create worker: ' + childPr.pid);
}

server.listen(8080, () => {
    const cpuNum =os.cpus().length;
    for(let i = 0; i < cpuNum; i ++) {
        createServer();
    }
})