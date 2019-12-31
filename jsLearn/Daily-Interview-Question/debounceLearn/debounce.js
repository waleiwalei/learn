var count = 0;
var container = document.getElementById('container');
var cancel = document.getElementById('cancel');

// container.onmousemove = debounce(getUserAction, 500);
// container.onmousemove = getUserAction;

var debounceHandler = debounce(initMoveHandler, 500, false);
container.onmousemove = debounceHandler.initHandler;
cancel.onclick = debounceHandler.cancel;

function initMoveHandler(e) {
    count ++;
    console.log('11--',container.innerHTML);
    container.innerHTML = count;
    console.log('22--',container.innerHTML);
}

// 防抖
function debounce(func, time, changeFirst) {
    let timer = null;
    var retDebounce = {
        initHandler: function() {
            let _this = this;
            // 已经存在定时器
            if(timer) {
                clearTimeout(timer);
            }
            // 立即执行则不需要再加定时器后续执行  只需要在特定时间后清空定时器  
            // TODO:[相当于把原本在time定时器这段时间内的func行为向前移动到最开始，并在结束时(即执行了func之后)清空计时器]
            if(changeFirst) {
                if(!timer){
                    func.apply(_this, arguments);
                }
                timer = setTimeout(() => {
                    clearTimeout(timer);
                    timer = null;
                }, time);
            } else {
                timer = setTimeout(() => {
                    func.apply(_this, arguments);
                }, time);
            }
        },
        cancel: function () {
            clearTimeout(timer);
            timer = null;
        }
    }
    return retDebounce;
}