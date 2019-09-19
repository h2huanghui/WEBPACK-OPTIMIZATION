const path = require('path')
const DllPlugin = require('webpack').DllPlugin
module.exports = {
    mode: 'development',
    entry: ['react','react-dom'], //sum minus
    output: {
        library: 'react', //打包后接收自执行函数的名字叫calc
        // libraryTarget:'commonjs2', //默认用var模式,也可以用commonjs模式(结果是exports["calc"]),也可以是commonjs(module.exports) umd this 
        filename: 'react.dll.js',
        path: path.resolve(__dirname,'dll')
    },
    plugins: [
        //本地使用了import React语法 ,需要去mainfest.json查找,找到后会加载对应的库的名字,可能会引用某个模块(列表中的某个模块),会去dll.js文件中查找(这里面存放的就是真实的文件)
        new DllPlugin({
            name: 'react', //缓存列表指向真实的文件
            path: path.resolve(__dirname,'dll/mainfest.json')
        })
    ]

}
//为了将calc打包成node可以使用的模块