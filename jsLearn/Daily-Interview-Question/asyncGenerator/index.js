// async/await generator实现
// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/33
// Fengziyin1234


// https://segmentfault.com/a/1190000007535316
// https://segmentfault.com/a/1190000011296839

async function test(){
	console.log('test');
	return 1;
}
async function foo(){
	var ret = await test();
	console.log(ret);
}
foo();
var promise = new Promise((resolve, reject)=>{
	console.log('promise~');
	resolve(222);
})
promise.then((data)=>{
	console.log(data)
})
// test 
// promise
// 222
// 1


// 一个疑问【两种触发click的区别？】
// https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
