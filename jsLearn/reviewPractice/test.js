// V8 引擎 sort 函数只给出了两种排序 InsertionSort 和 QuickSort，数量小于10的数组使用 InsertionSort，比10大的数组则使用 QuickSort

let array = [3,1,2,10,5,4];
Array.prototype.sort = function (funcSort) {
    let _this = this; // arr
    if(funcSort && typeof funcSort === 'function') {
        for(let i = 0; i < _this.length; i ++) {
            for(let j = i + 1; j < _this.length; j ++) {
                if(funcSort(_this[i], _this[j]) > 0) {
                    [_this[i], _this[j]] = [_this[j], _this[i]];
                }
            }
        }
    } 
}

// array.sort((x, y) => (x - y));
array.sort(() => (Math.random()<0.5?1:-1));
console.log(array);

