const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

// Analysis and Construction Speed
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const PerformanceAnalysis = process.env.NODE_ENV !== 'performance'
const smp = new SpeedMeasurePlugin({
    disable: PerformanceAnalysis
})

// Visualize size of webpack output files with an interactive zoomable treemap.
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const plugins = []
if (!PerformanceAnalysis) {
    plugins.push(
        new BundleAnalyzerPlugin()
    )
}

const resolve = dir => path.resolve(__dirname, dir)

module.exports = smp.wrap({
    mode: 'production',
    entry: {
        app: './src/main.js'
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
        ],
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                //Create a commons chunk, which includes all code shared between entry points.
                commons: {
                    chunks: 'all',
                    name: 'commons',
                    minChunks: 2,
                }
            }
        }
    },
    resolve: {
        alias: {
            'vue$': resolve('node_modules/vue/dist/vue.esm.js'),
            '@': resolve('src')
        },
        extensions: ['.js', '.json', '.vue', '.scss']
    },
    devtool: 'none',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
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
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    // 移动端开发解开注释
                    // {
                    //     loader: 'postcss-loader',
                    //     options: {
                    //         plugins: () => [
                    //             require('autoprefixer')()
                    //         ]
                    //     }
                    // }
                ]
            },
            {
                test: /\.less$/,
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
                test: /\.scss$/,
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
                    'sass-loader',
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
        new FriendlyErrorsWebpackPlugin(),
        // 将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块
        new VueLoaderPlugin(),
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
        // https://github.com/mmiller42/html-webpack-externals-plugin
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'vue',
                    entry: 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
                    global: 'Vue'
                }
            ]
        }),
        new CleanWebpackPlugin(),

        // 构建报错异常处理
        function() {
            this.hooks.done.tap('done', stats => {
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') < 0) {
                    console.log('build error!')
                    process.exit(1)
                }
            })
        }
    ].concat(plugins),
    stats: 'errors-only'
})
