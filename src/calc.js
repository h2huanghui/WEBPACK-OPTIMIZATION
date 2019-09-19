
export const sum = (a, b) => {
    return a + b + 'sum'
}

export const minus = (a, b) => {
    return a - b + 'minus'
}

//-问题:打包后的结果放在了自执行函数,无法执行
//-解决方案:接收自执行函数的返回值 node里面module.exports