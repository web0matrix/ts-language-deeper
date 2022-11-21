const delay: MethodDecorator = (target, propertyKey, descriptor) => {
  const method = descriptor.value as Function
  // @ts-ignore
  descriptor.value = () => {
    setTimeout(() => {
      method()
    }, 2000)
  }
  return descriptor
}

const dealyMixin = (timeout: number) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value as Function
    // @ts-ignore
    descriptor.value = () => {
      setTimeout(() => {
        method()
        console.log(new Date(Date.parse(new Date().toString())))
      }, timeout)
    }
    return descriptor
  }
}

const lowerCaseDecorator = (target: any, propertyKey: string) => {
  let value = target[propertyKey]
  const getter = () => value + '123'
  const setter = (newValue: string) => {
    value = newValue.toLowerCase() + 'decorator'
  }
  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  })
}

class User {
  @lowerCaseDecorator
  title: string = 'Title'

  @delay
  say() {
    console.log('say')
  }

  @dealyMixin(200)
  sayMixin() {
    console.log('sayMixin')
  }
}

console.log(new Date(Date.parse(new Date().toString())))
const u = new User()
u.say()
u.sayMixin()
u.title = '@#!#!@#DASJSKA'
console.log(u.title + 2)
