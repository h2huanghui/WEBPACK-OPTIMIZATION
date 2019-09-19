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