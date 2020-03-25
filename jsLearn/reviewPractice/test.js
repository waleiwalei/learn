let obj = {
    age: 20,
    info: function() {
        return () => {
            console.log(this.age)
        }
    }
}
let person = {age: 28}
let info = obj.info();
info();     // 20
let info2 = obj.info.call(person)
info2();    // 28


// function A() {

// }
// A.prototype.x = 10;
// var a1 = new A();
// console.log(a1.x);

// A.prototype = {
//     x: 20
// }
// console.log(a1.x);
// var a2 = new A()
// console.log(a2.x);


// function Person(){}

// var person = new Person();

// person.name = 'Daisy';
// console.log(person.name) 
// delete person.name;
// console.log(person.name)


// setTimeout(()=>{
//     console.log('timer1')
//     Promise.resolve().then(function() {
//         console.log('promise1')
//     })
// }, 0)
// setTimeout(()=>{
//     console.log('timer2')
//     Promise.resolve().then(function() {
//         console.log('promise2')
//     })
// }, 0)

// fs.readFile(()=>{
//     setTimeout(() => {
//         console.log('timeout');
//     }, 0);
//     setImmediate(() => {
//         console.log('immediate');
//     });
// })


// console.log('start')
// setTimeout(() => {
//   console.log('timer1')
//   Promise.resolve().then(function() {
//     console.log('promise1')
//   })
// }, 0)
// setTimeout(() => {
//   console.log('timer2')
//   Promise.resolve().then(function() {
//     console.log('promise2')
//   });
//   process.nextTick(()=>{
//       console.log('nextTick');
//   })
// }, 0)
// Promise.resolve().then(function() {
//   console.log('promise3')
// })
// console.log('end')