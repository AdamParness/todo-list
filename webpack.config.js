const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // Change to 'production' for production build
    entry: './src/index.js',  // Your entry point
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,  // Clean dist folder before each build
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Todo List',
        }),
    ],
    devServer: {
        static: './dist',
    },
};