function push(element) {
    this.dataSource[this.top++] = element;
}

function pop() {
    return this.dataSource[--this.top];
}

function peek() {
    return this.dataSource[this.top - 1];
}

function length() {
    return this.top;
}

function clear() {
    this.top = 0;
}

function Stack() {
    this.dataSource = [];
    this.top = 0;   // 指向下一个压栈元素索引
    this.push = push;
    this.pop = pop;
    this.peek = peek;

    this.length = length;
    this.clear = clear;
}

// 应用
// 1.进制转换
function change(number, base) {
    let stack = new Stack();
    let resStr = '';
    while(number) {
        stack.push(number % base);
        number = Math.floor(number / base); // *****
    }
    while(stack.length()) {
        resStr += stack.pop();
    }
    return resStr;

}
// console.log(change(10, 2));

// 2.回文判断
function isPalindrome(str) {
    let stack = new Stack();
    for(let i = 0, length = str.length; i < length; i ++) {
        stack.push(str[i]);
    }
    let reverseStr = '';
    while (stack.length()) {
        reverseStr += stack.pop();
    }
    return reverseStr == str;
}
// console.log(isPalindrome('abcdcba'));
// console.log(isPalindrome('abcdaaecba'));

// 3.递归演示
// 使用栈模拟递归求阶乘
function fact(n) {
    let stack = new Stack();
    while (n > 1) {
        stack.push(n--);
    }
    let res = 1;
    while (stack.length()) {
        res *= stack.pop();
    }
    return res;
}

// console.log(fact(5));

// practice
// 1.判断括号是否匹配
function judge(str) {
    let left = ['(', '[', '{'], right = [')', ']', '}'];
    let stack = new Stack();
    for(let i = 0; i < str.length; i ++) {
        if(left.indexOf(str[i]) > -1) {
            stack.push(str[i]);
        }
        if(right.indexOf(str[i]) > -1) {
            switch (str[i]) {
                case ')':
                    if(stack.peek() == '(') {
                        stack.pop();
                        break;
                    }
                    return i;
                case ']':
                    if(stack.peek() == '[') {
                        stack.pop();
                        break;
                    }
                    return i;
                case '}':
                    if(stack.peek() == '{') {
                        stack.pop();
                        break;
                    }
                    return i;
            }
        }
    }
    if(stack.length()) {
        return str.length;
    }
    return -1;
}

// console.log(judge('1+2*(3-6)'));


// 2. 中缀表达式转后缀【两个栈 一个存数字一个存操作符】 并利用栈求值
// function infixToPostfix(exp) {
//     var operatorStack = new Stack();
//     var postfixExp = [];

//     exp.split('').forEach(function (char) {

//         if (isOperator(char)) {
//             // 比较优先级
//             while (comparePriority(operatorStack.peek(), char)) {
//                 var tmp = operatorStack.pop();
//                 if (tmp !== '(' && tmp !== ')') {
//                     postfixExp.push(tmp);
//                 }
//                 if (tmp === '(' && char === ')') { // 匹配到左括号的时候，结束循环。
//                     break;
//                 }
//             }
//             if (char !== ')') {
//                 operatorStack.push(char);
//             }
//         } else {
//             postfixExp.push(char);
//         }
//     });
//     while (operatorStack.length()) {
//         postfixExp.push(operatorStack.pop());
//     }
//     return postfixExp.join('');
// }

// function computePostfix(exp) {
//     var numStack = new Stack();
//     exp.split('').forEach(function (char) {
//         if (char.trim()) {
//             if (!isOperator(char)) {
//                 numStack.push(char);
//             } else {
//                 var tmp = numStack.pop();
//                 numStack.push(eval(numStack.pop() + char + tmp));
//             }
//         }
//     });
//     return numStack.pop();
// }

// var postfixExp = infixToPostfix('(8-2)/(3-1)*(9-6)');
// var postfixExpValue = computePostfix(postfixExp);

// console.log(postfixExp); // 82-31-/96-*
// console.log(postfixExpValue); // 9

// 3.佩兹糖果盒 不改变原有顺序 移除所有黄色糖果
// 1:红 2：黄 3：白
let arr = [1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 1, 1, 3, 3, 1, 2, 3, 1, 3, 2]
function remove(arr) {
    let stack = new Stack();
    let res = [];
    for(let i = 0; i < arr.length; i ++) {
        if(arr[i] !== 2) {
            stack.push(arr[i]);
        }
    }
    while (stack.length()) {
        res.push(stack.pop());
    }
    return res.reverse();
}
console.log(remove(arr));





// https://www.jianshu.com/p/0e83898c4dd7