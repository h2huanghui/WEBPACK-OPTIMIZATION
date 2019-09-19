## 1.基本配置见webpack.config.js babel如下
```
{
    test: /\.js$/,
    use: 'babel-loader',
},
```
=>
```
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        options: { //.babelrc
            presets: [
                "@babel/preset-env",
                "@babel/preset-react"
            ]
        }
    }
}
```
## 2.CSS优化，尽量去删除无用的样式(CSS样式名尽量不要去html标签相同)
npm i purgecss-webpack-plugin glob -D
```
const glob = require('glob') //主要功能是查找匹配文件
let paths = glob.sync('./src/**/*')//任意文件夹的任意文件
console.log(paths)
结果:
[ './src/index.css',
  './src/index.js',
  './src/main.js',
  './src/template.html' ]
```
注意:

1) 不能在style中删除 只能配合MiniCssExtractPlugin使用

2) 动态生成的样式名,可以单独放在一个文件里面,不要去匹配就可以了,语法glob参考文档

## 3.图片压缩插件(降低分辨率和清晰度)
```
npm install image-webpack-loader -D
```
在file-loader之前使用压缩图片插件 (对源文件处理不太合理)

npm run build之后,可以看到图片大小被压缩了

## 4.CDN加载文件 (将jquery不打包)
Bootcdn

1) 在html中插入一个script标签

问题:存在一个问题。js中引入jquery,还是会打包。所以加一个外部变量,这样就不会被打包了。
```
 externals: {
            'jquery':'$' //不去打包代码中的jquery
        },
```
2) 如果是多个文件,需要多次引入。可以通过js来动态插入
```
npm i add-asset-html-cdn-webpack-plugin -D

new AddAssetHtmlCdnPlugin(true, {
    'jquery':'https://cdn.bootcss.com/jquery/3. jquery.min.js'
}),
```

## 5.Tree-shaking

随着项目变大时,摇晃掉无用的代码(只支持es6语法,而且默认只在生产环境使用!!!)

calc.js
```
export const sum = (a, b) => {
    return a + b + 'sum'
}

export const minus = (a, b) => {
    return a - b + 'minus'
}


```

main.js
```
import { minus } from './calc'
console.log(minus(1,1))
```

只使用到minus,没有使用到sum 。希望开发环境模拟线上打包时，能有提示
```
optimization: {
    usedExports: true //把用到的模块和我说一下
},

```
会发现bundle.js中多了注释如下:
```
/*! exports provided: sum, minus */(本来就有)
/*! exports used: minus */
```
## 5.1会存在一个问题。
main.js中引入了test.js,但是main.js引入了但是并未使用。test.js代码如下：
```
function test() {
    return 'hello'
}
console.log(test()) 
export default test
```
test.js内部自己执行了代码。(被称为副作用,有可能是外面文件引错了,但代码本身还是执行了)

webpack不认为这是无用的代码,还是执行到代码。所以需要我们配置来手动删除

package.json中
```
"sideEffects":false, //默认是true(使用副作用),设置为false(不要副作用)
```

## 5.2这种方式存在一个问题,即在main.js中引入css文件(css引入但也不会被去使用,就会也把这行代码删除失效)
1) 通过require(只针对es6语法,但有些格格不入)
2) package.json配置css文件不是副作用
```
"sideEffects": ["**/*.css"],
```

## 6.Scope Hoisting(wepack内置) 作用域提升(只在生产环境使用)

每个模块都是函数,会导致内存过大。(在浏览器中跑的时候，都会产生一个作用域；一声明也会有作用域)

## 7.DllPlugin (动态连接库,可以用作生产环境,可能有100多个,会有更好地方法)
dll功能在开发之前 就先抽离好 打好包 以后就不用打包了

场景:每次编译都会重新构建react 和 react-dom

react react-dom先打包好放好。

但是问题是,代码中还是引入的node modules下的啊...

建立缓存列表 mainfest.json(先去找这个里面有没有)

react:打包后的文件

react-dom:打包后的文件

## 如何打包第三方库!!!
打包单个文件webpack.dll.js
```
const path = require('path')
module.exports = {
    mode: 'development',
    entry: './src/calc.js', //sum minus
    output: {
        library: 'calc', //打包后接收自执行函数的名字叫calc
        libraryTarget:'commonjs2', //默认用var模式,也可以用commonjs模式(结果是exports["calc"]),也可以是commonjs(module.exports) umd this 
        filename: 'calc.js',
        path: path.resolve(__dirname,'dll')
    }
}
```
package.json
```   
 "dll":"webpack --config webpack.dll.js"

```

打包多个文件,entry改为数组
```
const path = require('path')
module.exports = {
    mode: 'development',
    entry: ['react','react-dom'], 
    output: {
        library: 'react', //打包后接收自执行函数的名字叫calc
        // libraryTarget:'commonjs2', //默认用var模式,也可以用commonjs模式(结果是exports["calc"]),也可以是commonjs(module.exports) umd this 
        filename: 'react.dll.js',
        path: path.resolve(__dirname,'dll')
    }
}
```

## 需要产生一个缓存列表，这个列表需要指向真实的文件
```
   plugins: [
        new DllPlugin({
            name: 'react', //缓存列表指向真实的文件
            path: path.resolve(__dirname,'dll/mainfest.json')
        })
    ]
```
本地使用了import React语法 ,需要去mainfest.json查找,找到后会加载对应的库的名字(也就是react.dll.js文件),可能会引用某个模块(列表中的某个模块),会去dll.js文件中查找(这里面存放的就是真实的文件)

## 告诉webpack去mainfest.json里面去查找
```
const DllReferencePlugin = require('webpack').DllReferencePlugin;
 new DllReferencePlugin({
    manifest: path.resolve(__dirname,'dll/mainfest.json')
})
```
没有放在dist文件夹的原因是,build的时候配置了 cleanWebpackPlugin。每次一大包删掉就没有意义。打包好就放在那里

## 问题：dll下的react.dll.js并未在页面中被引用
npm run dev报错 
```
external_"react":1 Uncaught ReferenceError: react is not defined
```
1) 可以在html中插入script标签(比较麻烦)
```
 <script src="../dll/react.dll.js"></script>
```
2) 插件(和cdn类似)
npm i add-asset-html-webpack-plugin -D
```
//把这个文件拷贝到dist文件夹下
new AddAssetHtmlPlugin({ filepath: require.resolve('dll/react.dll.js') }),
```

## 8.动态加载(原理就是jsonp)
比如页面一个按钮,只有点击了才调用。但如果在页面初始化的时候,就去打包,性能会比较差。我们希望的是点击按钮的时候,才会动态加载这个文件
```
import { sum } from './calc'
let button = document.createElement('button')

button.addEventListener('click', () => {
    console.log(sum(1, 2))
})
button.innerHTML = 'Click Me'
document.body.appendChild(button)
```
=> 
```
let button = document.createElement('button')

button.addEventListener('click', () => {
    //草案语法 
    //动态加载 类似于路由懒加载 import()语法-结果是一个promise
    //webpack遇到这种语法,会使用jsonp动态加载这个calc文件
    import('./calc').then(data => {
        console.log(data.sum(1,7))
    })
})
button.innerHTML = 'Click Me'
document.body.appendChild(button)
```

点击按钮,可以看到浏览器请求0.bundle.js(代码分割被分割了)

0可以修改(chunkFilename)

```
output: { //出口
    filename: 'bundle.js', //同步打包的名字
    chunkFilename: '[name].min.js', //异步打包的名字,name默认是从0开始,1,2, ...也可以修改
    path: path.resolve(__dirname, "dist")
},
```
```
import(/* webpackChunkName:'video' */'./calc').then(data => {
    console.log(data.sum(1,7))
})

```



