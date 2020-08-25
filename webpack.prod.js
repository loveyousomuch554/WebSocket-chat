/**
 * webpack.prod.js for production mode 
 */
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        publicPath: '/chat/'
    },
})