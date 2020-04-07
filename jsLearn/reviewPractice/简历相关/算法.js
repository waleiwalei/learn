// 回文函数
function hw(str) {
    let strReverse = str.split('').reverser().join('');
    return strReverse === str;
}
// 数组去重
function arrQC(arr) {
    // filter+arr2
    // set+from
    // forEach
}
// 字符串中出现最多的字符
function getNum(str) {
    let obj = {};
    for(let i = 0; i < str.length; i ++) {
        if(obj[str[i]]) {
            obj[str[i]] ++;
        } else {
            obj[str[i]] = 1;
        }
    }
    let objKeys = Object.keys(obj);
    let max = 0, str = '';
    objKeys.forEach((item)=>{
        if(obj[item] > max) {
            max = obj[item];
            str = item;
        }
    });
    return str;
}
// 冒泡排序 时间复杂度O(n^2) 空间复杂度O(1)
let arr = [1,5,23,6,8,3,78,94,42];
function mpSort(arr) {
    for(let i = 0; i < arr.length; i ++) {
        for(let j = i; j < arr.length; j ++) {
            if(arr[i] > arr[j]) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    }
}
// mpSort(arr)
// console.log(arr);

// 快速排序
let arr = [1,5,23,6,8,3,78,94,42];
function quickSort(arr, left, right) {
    left = left || 0;
    right = right || arr.length - 1;
    let i = left, j = right;
    if(left >= right) return;
    while(i < j) {
        while(arr[j] >= arr[left] && i < j) {
            j --;
        }
        while(arr[i] <= arr[left] && i < j) {
            i ++;
        }

        if(i != j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        if(i == j) {
            [arr[left], arr[j]] = [arr[j], arr[left]];
        }
    }
    quickSort(arr, left, j - 1);
    quickSort(arr, j + 1, right);
}
// quickSort(arr);
// console.log(arr);

// 插入排序
let arr = [3, 10, 1, 56, 48, 9, 27];
sum = 0;
function insertSort(arr) {
    let i = 0, j =0;
    // arr[0]这部分当做初始有序部分
    for(i = 1; i < arr.length; i ++) {
        let temp = arr[i];  // 待插入元素
        j = i - 1;
        // 两个条件同时判断 如果不大于temp 退出当次循环即可
        for(j = i - 1; j >= 0 && arr[j] > temp; j --) {
            arr[j+1] = arr[j];
        }
        // 在当次循环结束后 把temp插入该插入的位置
        // 记得j+1 for循环结束后j-1了
        arr[j+1] = temp;
    }
}
insertSort(arr);
console.log(arr);

// 最长公共子串




// 不借助临时变量 进行两个整数的交换
/** 
 * 思路：用一个抽象的a‘和b’变量去理解更好理解
 *
 * b' = b - a
 * 如何构造a'能实现结果为b【a + (b - a) 就能】
 * a' = a + (b - a) = a + b'
 * 在实现构造b' = a【a + (b - a) - ( b - a)就能】
 * b' = b' - a'
*/
function change(a, b) {
    b = b - a;
    a = a + b;
    b = a - b;
}

// 求正数组最大差值
let arr = [12, 4, 76, 89, 24];
function getMax(arr) {
    let max = -Infinity, min = Infinity;
    for(let i = 0; i < arr.length; i ++) {
        max = max < arr[i] ? arr[i] : max;
        min = min > arr[i] ? arr[i] : min;
    }
    return max - min;
}
console.log(getMax(arr));

// 返回指定长度的随机字符串
/** 
 * String.fromCharCode 通过编码值在unicode编码库查找指定字符
 * str.charAt() 查找字符串中指定位置的字符
 * str.charCodeAt() 查找指定位置上字符的unicode编码
*/
// 注意字符串的某一位没法直接修改！！let str = ''; str[0] = 'a'; str //''
// 所以用了数组  或者str = ''; str = str+'xxxx';
function getRandomStr(len) {
    let str = [], index = 0;
    let baseStr = 'abcdefgABCDEFG1234567890';
    while(index < len) {
		str[index] = baseStr[parseInt(Math.random() * baseStr.length)];
        index ++;
    }
    return str.join('');
}
// console.log(getRandomStr(4))

// 二分查找法
/** 
 * 递归方式要找到递归出口
 * 非递归如果是while 就找到循环条件（其实就是反向的递归出口）
*/
// 递归
function depart(arr, item, start = 0, end = arr.length - 1) {
    let mid = parseInt((start + end) / 2);
    // 递归出口
    if(start > end) {
        return -1;
    }
    if(arr[mid] > item) {
        return depart(arr, item, start, mid - 1);
    } else if(arr[mid] < item) {
        return depart(arr, item, mid + 1, end);
    } else {
        return mid;
    }
}
// console.log(depart([1,2,3,4,5,7], 7)); // 5
// console.log(depart([1,2,3,4,5,8], 7)); // -1
// 非递归
function depart(arr, item) {
    let start = 0, end = arr.length - 1;
    // 循环条件
    while(start <= end) {
        let mid = parseInt((start + end) / 2);
        if(arr[mid] < item) {
            start = mid + 1;
        } else if(arr[mid] > item) {
            end = mid - 1;
        } else {
            return mid;
        }
    }
    return -1;
}

// 使用闭包获取每个li的index ?? 
let lis = document.getElementsByTagName('li');
for(var i = 0; i < lis.length; i ++) {
    lis[i].onClick = (function(i){
        return function() {
            console.log('inner-i',i);
        }
    })(i)
}

// 二叉树
function Tree(value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
}
// 广度优先遍历 使用队列先进先出
function BFS(treeNode) {
    let queue = [];
    if(treeNode) {
        queue.push(treeNode);
    } else {
        return;
    }
    while(queue.length) {
        let currentNode = queue.shift();
        let {left, right} = currentNode;
        console.log(currentNode.value);
        left && queue.push(left);
        right && queue.push(right);
    }
}
// 深度优先遍历 使用栈 右侧先进去
function DFS(treeNode) {
    let stack = [];
    if(treeNode) {
        stack.push(treeNode);
    } else {
        return;
    }
    while(stack.length) {
        let currentNode = stack.pop();
        let {left, right} = currentNode;
        console.log(currentNode.value);
        right && stack.push(right);
        left && stack.push(left);
    }
}


// 一个字符串由()[]相互嵌套组成,分析出来有什么 输出出来 [栈]
var str = '(([]())[])';
// 用栈 找到匹配的右侧项目出栈并输出
function findKH(str) {
    let stack = [];
    for(let i = 0; i < str.length; i ++) {
        strI = str[i];
        if(strI == '(' || strI == '[') {
            stack.push(strI);
        } else {
            strLeft = stack.pop();
            console.log(strLeft, strI);
        }
    }
}
findKH(str);
// 更灵活的话就多加一个功能函数，把右侧字符和左侧字符返回不同值 cur是左侧 入栈 cur是右侧 则直接出栈并打印

// 讲一个数组中间数最大，两次依次递减即可
let arr = [5, 8, 7, 2, 6, 30, 24, 9];
function findMax(arr) {
    let max = -Infinity, index = -1;
    arr.forEach(item=>{
        if(max < item) max = item;
    });
    arr.splice(index, 1);
    return max;
}

// 循环找剩余中最大值，插入左边或者右边push/unshift
function makeNewArr(arr) {
    let arr2 = [...arr];    // 不能改变这里的初始数组 不然循环次数会少
    let newArr = [], max = -Infinity;
    for(let i = 0; i < arr.length; i ++) {
        max = findMax(arr2);
        Math.random() > 0.5 ? (newArr.push()) : (newArr.unshift());
    }
}


// 随机排序数组
    // sort函数参数  
    function foo(a, b){
        // 返回值小于0 a在b前边 因此
        // 从小到大
        return a - b;
    }
    // 1. 低效 
    let arr;
    arr.sort(function() {
        return Math.random() > 0.5 ? -1 : 1;
    })
    // 2. 高效版
    let arr;
    for(let i = 0; i < arr.length; i ++) {
        let index = parseInt(Math.random() * arr.length);
        [arr[index], arr[i]] = [arr[i], arr[index]];
    }