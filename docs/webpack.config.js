var path = require("path")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: {
        "build/bundle": "./js/app.js"
    },
    output: {
        path: path.resolve("."),
        filename: "[name].js"
    },
    // watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: 'env'
                    }
                }
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'autoprefixer-loader']
                // use: [{
                //     // loader: 'style-loader'
                //     // loader: ExtractTextPlugin.extract(['css-loader', 'autoprefixer-loader'])
                //     loader: ExtractTextPlugin.extract({
                //         fallback: 'style-loader',
                //         use: ['css-loader', 'autoprefixer-loader']
                //     })
                // }, {
                //     loader: 'css-loader'
                // }]
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                // loader: ExtractTextPlugin('style-loader', 'css-loader')
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!autoprefixer-loader'
                })
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css', '.html']
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
}