const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
const glob = require('glob') //主要功能是查找匹配文件
const PurgecssPlugin = require('purgecss-webpack-plugin')
const AddAssetHtmlCdnPlugin = require('add-asset-html-cdn-webpack-plugin')

module.exports = (mode) => {
    console.log(mode)
    return {
        mode: mode,
        entry: path.resolve(__dirname, './src/main.js'), //入口
        output: { //出口
            filename: 'bundle.js',
            path: path.resolve(__dirname, "dist")
        },
        externals: {
            'jquery': '$' //不去打包代码中的jquery
        },
        module: {
            rules: [{
                    test: /\.(png|jpg|gif)$/,
                    use: [{ //loader从下往上执行,从右往左执行
                            loader: 'file-loader'
                        },
                        mode !== 'development' && {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                // optipng.enabled: false will disable optipng 
                                optipng: {
                                    enabled: false,
                                },
                                pngquant: {
                                    quality: [0.90, 0.95],
                                    speed: 4
                                },
                                gifsicle: {
                                    interlaced: false,
                                },
                                // the webp option will enable WEBP
                                webp: {
                                    quality: 75
                                }
                            }
                        }
                    ].filter(Boolean)
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
        optimization: {
            usedExports: true //把用到的模块和我说一下
        },
        plugins: [
            mode !== 'development' && new PurgecssPlugin({
                paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, {
                    nodir: true
                }) //不匹配目录,只匹配文件
            }),
            mode !== 'development' && new MiniCssExtractPlugin({
                filename: "css/[name].css"
            }),
            new HtmlWebpackPlugin({
                template: './src/template.html',
                filename: 'index.html'
            }),
            new AddAssetHtmlCdnPlugin(true, {
                'jquery': 'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js'
            }),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*'] //默认所有目录下的所有文件
            })
        ].filter(Boolean)
    }
}