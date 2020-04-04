// function validator(target, validator) {
//   return new Proxy(target, {
//       _validator: validator,
// 　　　　　　　//set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。
//       set(target, key, value, proxy) {
//           if (target.hasOwnProperty(key)) {
//               let va = this._validator[key]
//               if (!!va(value)) {
//                   return Reflect.set(target, key, value, proxy)
//               } else {
//                   throw Error(`不能设置${key}到${value}`)
//               }
//           } else {
//               throw Error(`${key}不存在`)
//           }
//       }
//   })
// }

// const personValidators = {
//   name(val) {
//       return typeof val === 'string'
//   },
//   age(val) {
//       return typeof val === 'number' && val > 18
//   }
// }

// class Person {
//   constructor(name, age) {
//       this.name = name;
//       this.age = age
//       return validator(this, personValidators)
//   }
// }
// const person = new Person('knyel', 30)
// console.log(person)
// person.name = 'lk'
// console.log(person)
// person.age = 12
// console.log(person)





















function Person(name, age) {
	this.name = name;
	this.age = age;
	return _proxy(this, checkPerson);
}
function _proxy(target, checkObj) {
	let _checkObj = checkObj;
	return new Proxy(target, {
		get(target, keyName) {
			return Reflect.get(target, keyName);
		},
		set(target, keyName, value) {
			if(target.hasOwnProperty(keyName)) {
				if(!!_checkObj[keyName](value)) {
					return Reflect.set(target, keyName, value);
				} else {
					throw new Error('set ' + keyName + ' error');
				}
			}
		}
	});
}
const checkPerson = {
	name: (name) => {
		return typeof name === 'string'
	},
	age: (age) => {
		return typeof age === 'number' && age > 0
	}
}
let person1 = new Person('test', 20);
person1.name = 2;
console.log(person1.name)