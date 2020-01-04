
// https://webpack.js.org/configuration/dev-server/
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, './src/main.ts'),
    output: {
        filename: '[name].bundle.[hash].js',
        path: path.resolve(__dirname, './dist'),
    },
    module: {
        rules: [
            { test: /\.ts?$/, loader: 'ts-loader', exclude: /node_modules/, },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Cody S. Carlson',
        filename: 'index.html',
        template: './src/index.html',
        base: '/dist',
        favicon: './src/assets/shadow.jpg',
      }),
      new CopyPlugin([
          { from: './src/assets', to: './assets' }
      ]),
    ],
    devServer: {
      contentBase: path.resolve(__dirname, './dist'),
      index: './index.html',
      hot: true,
      hotOnly: true,
      open: true,
      port: 8080,
    //   proxy: {
    //     '/api': {
    //       target: 'http://localhost:3000',
    //       pathRewrite: {'^/api' : ''}
    //     }
    //   },
    },
};
