/**
 * 拆包
 * library包 + 业务包
 */
const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        library: [
            'vue-router',
            'vuex'
        ]
    },
    output: {
        filename: '[name]_[chunkhash].js',
        path: path.resolve(__dirname, 'lib/library'),
        library: '[name]_[chunkhash]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.resolve(__dirname, 'lib/manifest.json')
        })
    ]
}