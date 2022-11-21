// 加上通过类型提示
interface Person {
  name: string
  address: string
}

export function enhancer(target: any) {
  console.log('class enhancer begin')
  target.prototype.name = 'TS 装饰器'
  target.prototype.address = 'ECMAScript 20222'
}

@enhancer // 普通装饰器
class Person {
  constructor() {}
}

const person = new Person()
console.log(person.name)
console.log(person.address)

function Component(options: { id: number; address: string }) {
  return function (target: any) {
    target.prototype.id = options.id
  }
}

@Component({
  id: 1,
  address: 'latest Bar',
})
class Cat {
  id: number | undefined

  constructor() {}

  printId(prefix: string) {
    console.log(prefix + this.id)
  }
}

const cat = new Cat()
cat.printId('MortenID: ')

export function propertyDecorator(target: any, propertyKey: string) {
  console.log(target, propertyKey)
}

class Car {
  @propertyDecorator
  carName: string

  constructor() {
    this.carName = 'BBA'
  }
}

const car = new Car()

// console.log(car.carName)

export function methodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log('methodDecorator called on: ', target, propertyKey, descriptor)
  const method = descriptor.value
  console.log(method.toString()) //test(){return"test"}
  descriptor.value = () => {
    return `<div>${method()}</div>`
  }
}

class Config {
  @methodDecorator
  test() {
    return 'test'
  }
}

const c = new Config()
console.log(c.test())
// {} carName
// {} test {
//   value: [Function: test],
//   writable: true,
//     enumerable: false,
//     configurable: true
// }
// <div>test</div>

export function parameterDecorator(
  target: any,
  propertyKey: string,
  parameterIndex: number,
) {
  console.log('parameterDecorator start', target, propertyKey, parameterIndex)
}

class Vehicle {
  price = '1000$'
  color: string | undefined

  constructor(color: string) {
    this.color = ' ' + color
  }

  getPrice(@parameterDecorator prefix: string): string {
    return prefix + this.price + this.color
  }
}

const v = new Vehicle('red')
console.log(v.getPrice('Q4: '))
