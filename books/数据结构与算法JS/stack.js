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

console.log(judge('1+2*(3-6)'));


// 2. 中缀表达式转后缀【两个栈 一个存数字一个存操作符】 并利用栈求值






// https://www.jianshu.com/p/0e83898c4dd7