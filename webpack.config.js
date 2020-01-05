
// https://webpack.js.org/configuration/dev-server/
require('dotenv').config();
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
//
var config = require('./app.json');

var { env: __env__ } = process
  , { NODE_ENV: __type__ } = __env__
  ;
var { environments, modules } = config;

module.exports = (env, argv) => {
    const MODE = argv.mode || __type__;
    var OPTIONS = environments[ MODE ];
    var BASE_HREF = OPTIONS.baseUrl
      , X
      ;
    
    console.log(`Building as ${MODE}`);
    
    return {
        mode: MODE,
        // entry: path.resolve(__dirname, './src/main.ts'),
        entry: modules,
        output: {
            filename: '[name].bundle.[hash].js',
            path: path.resolve(__dirname, './dist'),
        },
        module: {
            rules: [
                { test: /\.ts?$/, loader: 'ts-loader', exclude: /node_modules/, },
                { test: /\.s[ac]ss$/i, use: [ 'style-loader', 'css-loader', 'sass-loader', ], },
            ]
        },
        resolve: {
            extensions: [ '.ts', '.js' ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'Cody S. Carlson',
                filename: 'index.html',
                template: './src/index.html',
                base: BASE_HREF,
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
};
