// 常用的API 总记不住怎么用

/* 
 * splice(index, howmany, newElement1, newElement2, ...)
 * 改变原数组,返回删除元素
*/
let arr = [1,2,3,4,5];
arr.splice(2, 0, 22, 33);
console.log(arr);

/** 
 * slice(start, end)
 * 返回数组从start->end-1的元素
*/
arr = [1,2,3,4,5];
console.log(arr.slice(2,4));