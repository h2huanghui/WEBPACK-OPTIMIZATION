function test() {
    return 'hello'
}

console.log(test()) //副作用(其他模块引用了,但没有用。但自己这个模块用到了,就是副作用)

export default test