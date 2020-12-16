const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../server/public'),
        filename: 'index.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'crsite',
            // options: {
            // appMountId: 'root',
            // }
            // appMountId: 'root',
            // Load a custom template (lodash by default)
            template: 'src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // { test: /\.txt$/, use: 'raw-loader' }
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './build',
        proxy: {
            '/api': 'http://127.0.0.1:8008'
        },
        historyApiFallback: {
            disableDotRule: true,
            index: '/index.html',
        },
    },
    // cache: true,
};
