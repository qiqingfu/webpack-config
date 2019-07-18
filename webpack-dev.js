const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
    mode: 'development',
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        port: '8080',
        stats: 'errors-only'
    },
    resolve: {
        alias: {
            'vue$': resolve('node_modules/vue/dist/vue.esm.js'),
            '@': resolve('src')
        },
        extensions: ['.js', '.json', '.vue', '.scss']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ],
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader',
                    // 移动端开发解开注释
                    // {
                    //     loader: 'px2rem-loader',
                    //     options: {
                    //         remUnit: 75,
                    //         remPrecision: 8
                    //     }
                    // }
                ]
            },
            {
                test: /\.(png|jpeg|jpg|svg)$/,
                use: 'file-loader'
            },
            {
                test: /\.png$/,
                use: 'png-plain-loader'
            }
        ]
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        // 将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            title: 'webpack-test'
        })
    ]
}
