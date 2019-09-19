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
2)动态生成的样式名,可以单独放在一个文件里面,不要去匹配就可以了,语法参考文档

## 3.图片压缩插件(降低分辨率和清晰度)
```
npm install image-webpack-loader -D
```
在file-loader之前使用压缩图片插件 (对源文件处理不太合理)

npm run build之后,可以看到图片大小被压缩了

## 4.CDN加载文件
Bootcdn

1)在html中插入一个script标签

问题:存在一个问题。js中引入jquery,还是会打包。所以加一个外部变量,这样就不会被打包了。
```
 externals: {
            'jquery':'$' //不去打包代码中的jquery
        },
```
2)如果是多个文件,需要多次引入。可以通过js来动态插入
```
npm i add-asset-html-cdn-webpack-plugin -D

new AddAssetHtmlCdnPlugin(true, {
    'jquery':'https://cdn.bootcss.com/jquery/3. jquery.min.js'
}),
```

