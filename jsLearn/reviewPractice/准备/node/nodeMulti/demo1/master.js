/** 
 * (Cluster)[https://zhuanlan.zhihu.com/p/42820028]
 * (Node多进程)[https://zhuanlan.zhihu.com/p/100550801]
 * (个人文章索引)[https://www.zhihu.com/people/wenzishi]
 * (10道nodejs面试题)[https://www.imooc.com/article/288056]
 * (通过node源码解析cluster)[https://cnodejs.org/topic/56e84480833b7c8a0492e20c]
*/
const fork = require('child_process').fork;
const net = require('net');

// 主进程创建的tcp Server
const server = net.createServer();
const child1 = fork('./child1.js');
const child2 = fork('./child2.js');

// 传递给子进程的tcp Server与此处的8080端口进行了绑定
server.listen(8090, () => {
    // 两个抢占式进程服务
    child1.send('server', server);
    child2.send('server', server);
    server.close();
})