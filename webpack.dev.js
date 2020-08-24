/**
 * webpack.dev.js for development mode
 */
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: '/chat'
    },
    devServer: {
        contentBase: './build',
        port: 6969
    }
})