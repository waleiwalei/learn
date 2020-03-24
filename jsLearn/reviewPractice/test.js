function Person() {

}

Person.prototype.name = 'Kevin';

var person = new Person();

person.name = 'Daisy';
console.log(person.name) 
delete person.name;
console.log(person.name)


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