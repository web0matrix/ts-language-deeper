import './delay'
//
// function enhancer(target: Function) {
//   target.prototype.name = 'enhancer'
//   // console.log(target)
// }
//
// function methodDecorator(
//   target: any,
//   propertyKey: string,
//   descriptor: PropertyDescriptor,
// ) {
//   // console.log(target, propertyKey, descriptor);
//   const method = descriptor.value
//   console.log(method.toString())
//   descriptor.value = () => {
//     return `<div>${method()}</div>`
//   }
// }
//
// // {} test {
// //   value: [Function: test],
// //   writable: true,
// //     enumerable: false,
// //     configurable: true
// // }
//
// // [class Config] test {
// //   value: [Function: test],
// //   writable: true,
// //     enumerable: false,
// //     configurable: true
// // }
//
// @enhancer
// class Config {
//   constructor() {}
//
//   @methodDecorator
//   test() {
//    return 'test'
//   }
// }
//
// const config = new Config()
// console.log(config.test())
// /**
//  * 类装饰器
//  */
