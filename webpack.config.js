const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (mode) => {
    console.log(mode)
    return {
        mode: mode,
        entry: path.resolve(__dirname,'./src/main.js'), //入口
        output: { //出口
            filename: 'bundle.js',
            path: path.resolve(__dirname,"dist")
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif)$/,
                    use: 'file-loader'
                },
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
                },
                {
                    test: /\.css$/,
                    use: [
                        mode !== 'development' ? MiniCssExtractPlugin.loader : 'style-loader',
                        "css-loader"
                    ]
                }
            ]
        },
        plugins: [
            mode !== 'development' && new MiniCssExtractPlugin({
               filename: "css/[name].css"
            }),
            new HtmlWebpackPlugin({
                template: './src/template.html',
                filename: 'index.html'
            })
        ].filter(Boolean)
    }
}