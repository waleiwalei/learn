## q-multiprocess
### 启动
```js
var qMultiProcess = require('@qnpm/qmultiprocess');
var opts = {
    numCPUs: require('os').cpus().length,
    port: '',
    // 子进程收到父进程消息后父进程执行的方法
    workerMessage: function (msg, workers) {
        qmonitor.messageHandler(msg, workers);
    },
    ready: function(workers) {
        initMonitor();
        var startupTime = Date.now() - startTime;
        qmonitor.addTime('startupTime', startupTime);
        console.log('startupTime', startupTime)
    }
}
qMultiProcess.listen(app/*express实例*/, opts);
```

### cluster
- 参考../../node/Node多进程.md