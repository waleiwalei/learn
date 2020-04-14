// 原型链继承 共享原型属性、无法传参
function Super(x) {
    this.x = x
}
function Sub(y) {
    this.y = y
}
let sup = new Sup();
Sub.prototype = sup;
Sub.prototype.constructor = Sub;

// 构造函数继承    无法调用父类方法
function Sub(y) {
    Super.call(this, x);
    this.y = y;
}

// 组合继承
function Sub(y) {
    Super.call(this, x);
    this.y = y;
}
Sub.prototype = new Super(x);
Sub.prototype.constructor = Sub;


// 原型式继承
function createObj(obj) {
    function F(){}
    F.prototype = obj;
    return new F();
}
// ==
Object.create(obj);

// 寄生式继承  实例方法不共享
function createObj(obj) {
    let newObj = Object.create(obj);
    // 这里可以加一些实例方法 
    return newObj
}


// 寄生组合式继承
function changeProto(sup, sub) {
    let newObj = Object.create(sup.prototype);
    sub.prototype = newObj;
    sub.prototype.constructor = sub;
}
