const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
// provide an intermediate caching
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const webpack = require('webpack')

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

// Webpack plugin to remove unused css.
const glob = require('glob')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const PATHS = {
    src: path.join(__dirname, 'src')
}

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
            new TerserJSPlugin({
                // Enable/disable multi-process parallel running.
                // before build time 3378ms
                // after build time 2872ms
                parallel: true,
                cache: true
            }),
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
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 3
                        }
                    },
                    'babel-loader?cacheDirectory=true'
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
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:10].[ext]'
                        }
                    },
                    // 统一压缩图片质量
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-90',
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
                ]
            },
            {
                test: /\.(otf|ttf|woff2?|eot)$/,
                loader: 'url-loader',
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
        // Currently invalid
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
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
        },

        // 引入分包预编译依赖
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'lib/manifest.json')
        }),
        new HardSourceWebpackPlugin()
    ].concat(plugins),
    stats: 'errors-only'
})
