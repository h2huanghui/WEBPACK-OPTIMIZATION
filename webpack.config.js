const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
const glob = require('glob') //主要功能是查找匹配文件
const PurgecssPlugin = require('purgecss-webpack-plugin')
const AddAssetHtmlCdnPlugin = require('add-asset-html-cdn-webpack-plugin')
const DllReferencePlugin = require('webpack').DllReferencePlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');

module.exports = (mode) => {
    console.log(mode)
    return {
        mode: mode,
        //entry 有三种写法 字符串 数组 对象
        entry: {
            'a': './src/a.js',
            'b': './src/b.js'
        },
        // entry: path.resolve(__dirname, './src/main.js'), //入口
        output: { //出口
            filename: '[name].js', //同步打包的名字
            // chunkFilename: '[name].min.js', //异步打包的名字,name默认是从0开始,1,2,...也可以修改
            path: path.resolve(__dirname, "dist")
        },
        // externals: {
        //     'jquery': '$' //不去打包代码中的jquery
        // },
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
            splitChunks: {
                chunks: 'async', //默认支持异步代码的代码分割 impot()
                minSize: 30000, //文件超过30k 就会抽离
                maxSize: 0,
                minChunks: 1, //最少模块引用一次才抽离
                maxAsyncRequests: 5, //最多5个请求
                maxInitialRequests: 3, //最多首屏加载3个请求
                automaticNameDelimiter: '~', //xxx~a~b 
                automaticNameMaxLength: 30, //最长名字大小不超过30
                name: true,
                cacheGroups: { //缓存组
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    common: { // default~a~b 改成common
                        name: 'common',
                        minChunks: 2, //把上面的覆盖掉
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        // optimization: {
        //     usedExports: true //把用到的模块和我说一下
        // },
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
                filename: 'index.html',
                chunks: ['a']
            }),
            new HtmlWebpackPlugin({
                template: './src/template.html',
                filename: 'login.html',
                chunksSortMode: 'manual', //手动排序
                chunks: ['b', 'a'] //(默认顺序以entry的顺序) 按照我自己配置的顺序引入,先引入b,再引入a。
            }),
            // new AddAssetHtmlCdnPlugin(true, {
            //     'jquery': 'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js'
            // }),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*'] //默认所有目录下的所有文件
            }),
            // new DllReferencePlugin({
            //     manifest: path.resolve(__dirname, 'dll/mainfest.json')
            // }),
            //把这个文件拷贝到dist文件夹下
            new AddAssetHtmlPlugin({
                filepath: require.resolve('./dll/react.dll.js')
            }),

            mode !== 'development' && new BundleAnalyzerPlugin()
        ].filter(Boolean)
    }
}