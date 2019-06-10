const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const resolve = dir => path.resolve(process.cwd(), dir)

const getFile = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const fileLists = glob.sync(resolve('src/pages/*/index.js'))

    Object.keys(fileLists)
        .map(index => {
            // 入口文件 *.js
            const filePath = fileLists[index]
            const match = filePath.match(/src\/pages\/(.*)\/index.js/)
            console.log(match)
            const fileName = match[1]
            entry[fileName] = filePath
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: resolve(`src/pages/${fileName}/index.html`),
                    filename: `${fileName}.html`,
                    title: fileName,
                    inject: true,
                    chunks: [fileName],
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preventAttributesEscaping: true,  // collapseWhitespace=true
                        minifyCSS: true,
                        minifyJS: true
                    }
                }),
            )
        })

    return {
        entry,
        htmlWebpackPlugins
    }
}

const {entry, htmlWebpackPlugins} = getFile()

module.exports = {
    mode: 'production',
    entry,
    output: {
        path: resolve('dist'),
        filename: '[name]_[chunkhash:10].bundle.js'
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin(),
            new OptimizeCSSAssetsPlugin()
        ]
    },
    resolve: {
        alias: {
            'vue$': resolve('node_modules/vue/dist/vue.esm.js'),
            '@': resolve('src')
        },
        extensions: ['.js', '.json', '.vue', '.scss']
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader',
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            },
            {
                test: /.vue$/,
                use: 'vue-loader'
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
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
                    'sass-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecision: 8
                        }
                    }
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
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name]_[hash:10].css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugins)
}
