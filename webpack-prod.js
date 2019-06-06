const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
    mode: 'production',
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:10].bundle.js'
    },
    optimization: {
        // 压缩 css代码
        // 重写 webpack4 默认的最小化器
        minimizer: [
            new TerserJSPlugin(),
            new OptimizeCSSAssetsPlugin()
        ]
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')()
                            ]
                        }
                    }
                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')()
                            ]
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')()
                            ]
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /.(png|jpeg|jpg|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:10].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[hash:10].css',
            chunkFilename: '[id].css'
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            title: 'webpack-test',
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preventAttributesEscaping: true,  // collapseWhitespace=true
                minifyCSS: true,
                minifyJS: true
            }
        }),
        new CleanWebpackPlugin()
    ]
}
