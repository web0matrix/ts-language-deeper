# TS-装饰器篇 |  01

## 基本介绍

装饰器是一种特殊类型的声明，它能够被附加到`类`、`方法`、`属性`或者`参数`上，

- 语法：装饰器使用 `@expression` 这种形式，`expression`求值后必须为一个函数，它会在`运行时`被调用，被装饰的声明信息做为参数传入
- 若要启用实验性的装饰器特性，必须`tsconfig.json`里启用`experimentalDecorators`编译器选项
- 常见的装饰器有: `类装饰器`、`属性装饰器`、`方法装饰器`、`参数装饰器`
- 装饰器的写法: 分为`普通装饰器(无法传参）`和`装饰器工厂(可以传参)`

装饰器的语法十分简单，只需要在想使用的装饰器前加上`@`符号，装饰器就会被应用到目标上：

```ty
function simpleDecorator() {
  console.log('---hi I am a decorator---')
}

@simpleDecorator
class A {}
```

##### 普通装饰器

```typescript

// 加上通过类型提示
interface Person {
  name: string
  address: string
}

function enhancer(target: any) {
  console.log('class enhancer')
  target.prototype.name = 'TS 装饰器'
  target.prototype.address = 'ECMAScript 2022'
}

@enhancer // 普通装饰器
class Person {
  constructor() {}
}

const person = new Person()
console.log(person.name)
console.log(person.address)

// class enhancer
// TS 装饰器
// ECMAScript 20222

```

##### 装饰器工厂

可以通过传递参数的方式注入需要的数据

```typescript
// options 传递过来的对象都可以注入到Class的原型上
function Component(options: { id: number; address: string }) {
  return function (target: any) {
    target.prototype.id = options.id
  }
}

@Component({
  id: 1,
  address: '2',
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
// MortenID: 1

```

## 装饰器分类

![装饰器分类](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/blogimage-20221121123301498.png)

```ty
// 类装饰器
@classDecorator
class Bird {

  // 属性装饰器
  @propertyDecorator
  name: string;
  
  // 方法装饰器
  @methodDecorator
  fly(
    // 参数装饰器
    @parameterDecorator
      meters: number
  ) {}
  
  // 访问器装饰器
  @accessorDecorator
  get egg() {}
}
```



### 类装饰器

> 类装饰器在类声明之前声明（紧靠着类声明），用来`监视`、`修改`或者`替换`类定义

```typescript
// 加上通过类型提示
interface Person {
  name: string
  address: string
}

function enhancer(target: any) {
  console.log('class enhancer')
  target.prototype.name = 'TS 装饰器'
  target.prototype.address = 'ECMAScript 2022'
}

@enhancer // 普通装饰器
class Person {
  constructor() {}
}

const person = new Person()
console.log(person.name)
console.log(person.address)
```

### 属性装饰器

属性装饰器表达式会在运行时当做函数被调用，传入下列两个参数

- 第一个参数： 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
- 第二个参数： 是属性的名称

```
function propertyDecorator(target: any, propertyKey: string) {
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
console.log(car.carName)
// {} carName
// BBA
```

我们再修改一下实例成员为静态成员

```typescript
class Car {
  @propertyDecorator
  // add static
  static carName: string

  constructor() {
    this.carName = 'BBA'
  }
}
// 输出类的构造函数
// [class Car] carName
```

### 方法装饰器

方法装饰器用来装饰方法

- 第一个参数： 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
- 第二个参数： 是方法的名称
- 第三个参数： 是方法的描述修饰方法

```typescript
function methodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log(target, propertyKey, descriptor)
    // {} test {
	//   value: [Function: test],
	//   writable: true,
	//     enumerable: false,
	//     configurable: true
	// }
  const method = descriptor.value // 获取原来方法
  console.log(method.toString()) //test(){return"test"}  结果正好和定义的函数表达式相同
  descriptor.value = () => {
    // 调用原来的方法结果再加上一些其他操作
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
// <div>test</div>
```

### 参数装饰器

参数装饰器用来装饰参数

- 第一个参数： 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
- 第二个参数： 成员的名字
- 第三个参数： 参数在函数参数列表中的索引

```typescript
function parameterDecorator(
  target: any,
  propertyKey: string,
  parameterIndex: number,
) {
  console.log(target, propertyKey, parameterIndex)  // {} getPrice 0
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
console.log(v.getPrice('Q4: '))  // Q4: 1000$ red

```



### 装饰器执行顺序

> 执行顺序 **属性>方法>方法参数>类**
> 注：**如果有多个同样的装饰器，它会先执行后面的装饰器。**

- 属性装饰器最先执行，谁先写先执行谁
- 参数装饰器再执行，
- 方法装饰器再执行
- 类装饰器最后执行
- 如果同类型，先执行离类近的
- 属性/方法/访问器装饰器而言，执行顺序取决于声明它们的顺序，两个同样的方法先声明先执行。

```typescript
function classDecorator(target: any) {
  console.log('classDecorator begin')
}

function propertyDecorator(target: any, propertyKey: string) {
  console.log('propertyDecorator begin')
}

function parameterDecorator(
  target: any,
  propertyKey: string,
  parameterIndex: number,
) {
  console.log('parameterDecorator begin')
}

function methodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log('methodDecorator begin')
}

@classDecorator
class OrderDecorator {
  @propertyDecorator
  order: number[] = [1, 3, 4, 5, 6]

  constructor() {}

  getOrder(@parameterDecorator id: number): number {
    return this.order[id]
  }

  @methodDecorator
  test() {
    return 'test'
  }
}

const order = new OrderDecorator()
console.log(order.getOrder(2))
// propertyDecorator begin
// parameterDecorator begin
// methodDecorator begin
// classDecorator begin
// 4


```

如果同类型，先执行离类近的

```typescript
// 如果同类型，先执行离类近的
function first() {
  console.log('first(): factory evaluated')
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('first(): called')
  }
}

function second() {
  console.log('second(): factory evaluated')
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('second(): called')
  }
}

class ExampleClass {
  @first()
  @second()
  method() {}
}
// first(): factory evaluated
// second(): factory evaluated
// second(): called
// first(): called

```

### 装饰器的执行时机

装饰器只在解释执行时应用一次,所有装饰器的执行在编译时而不是运行时

```typescript
function f(C) {
  console.log('apply decorator')
  return C
}

@f
class A {}

// output: apply decorator
```

### 参考

[TypeScript装饰器完全指南](https://saul-mirone.github.io/zh-hans/a-complete-guide-to-typescript-decorator/)

[How TypeScript Decorators really work | TypeScript in a Nutshell](https://www.youtube.com/watch?v=oF7m5ibwzAw)