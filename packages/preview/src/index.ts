console.log('hello')

interface X {
  name: string
  age?: number
}

class X2 implements X {
  public name: string
  constructor(name: string) {
    this.name = name
  }
}
