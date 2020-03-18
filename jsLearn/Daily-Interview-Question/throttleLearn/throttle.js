var count = 1;
var container = document.getElementById('container');

// container.onmousemove = throttleHandler;
container.onmousemove = throttle(throttleHandler, 3000);

function throttleHandler() {
    count++;
    container.innerHTML = count;
}


/**
 * 时间戳
 * 会立即执行
 */
// function throttle(func, wait) {
//     let context = this;
//     let compareTime = 0;
//     return function () {
//         // let curTime = +new Date();
//         let curTime = new Date().getTime();
//         if(curTime - compareTime >= wait) {
//             func.apply(context, arguments);
//             compareTime = curTime;
//         }
//     }
// }

/**
 * 定时器
 * 会在wait时间后执行这次行为
 */
// function throttle(func, wait) {
//     let timer = null;
//     let context = this;
//     return function () {
//         if(!timer) {
//             timer = setTimeout(() => {
//                 func.apply(context, arguments);
//                 timer = null;
//             }, wait);
//         }
//     }
// }

/** 
 * 有头有尾
 https://github.com/mqyqingfeng/Blog/issues/26
*/
function throttle(func, wait) {
    let context = this;
    let compareTime = 0;
    let timer = null;
    return function () {
        let curTime = +new Date();
        if(curTime - compareTime >= wait) {
            func.apply(context, arguments);
            compareTime = curTime;
        } else if(!timer) {
            timer = setTimeout(() => {
                func.apply(context, arguments);
                timer = null;
            }, wait);
        }
    }
}