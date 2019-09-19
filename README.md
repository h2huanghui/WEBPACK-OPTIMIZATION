## 1.babel
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
