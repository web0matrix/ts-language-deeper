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

  @methodDecorator
  test() {
    return 'test'
  }

  @methodDecorator
  getOrder(@parameterDecorator id: number): number {
    return this.order[id]
  }
}

const order = new OrderDecorator()
console.log(order.getOrder(2))
// propertyDecorator begin
// parameterDecorator begin
// methodDecorator begin
// classDecorator begin
// 4
