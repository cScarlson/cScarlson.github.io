
// https://webpack.js.org/configuration/dev-server/
require('dotenv').config();
var path = require('path');
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
var { NormalModuleReplacementPlugin } = webpack;
//
var config = require('./app.json');

module.exports = (env, argv) => {
    var { env: ENV } = process  // alias
      , { TYPE = 'development' } = ENV  // default to
      , { mode: TYPE = TYPE } = argv  // alias and default to
      ;
    var { environments, modules, proxy } = config;
    var ENV = { ...process.env, TYPE };  // override with defaults
    var OPTIONS = environments[ TYPE ];
    var { baseUrl, replacements } = OPTIONS;
    var REPLACEMENTS = replacements.map(mapReplacements);
    
    function mapReplacements({ target, replacement }) {
        var exp = target.replace(/\//g, '[\\\\\\\/]'), re = new RegExp(exp);
        var plugin = new NormalModuleReplacementPlugin(re, `./${replacement}`);
        return plugin;
    }
    
    process.env = ENV;
    console.log(`Building as ${process.env.TYPE}`);
    
    return {
        mode: TYPE,
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
            plugins: [
                new TsconfigPathsPlugin({ configFile: './tsconfig.json' }),
            ],
            // alias: {
            //     '@motorman/*': './src/core/*',
            // },
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'Cody S. Carlson',
                filename: 'index.html',
                template: './src/index.html',
                base: baseUrl,
                favicon: './src/assets/shadow.jpg',
            }),
            new CopyPlugin([
                { from: './src/assets', to: './assets' },
                { from: './src/mocks', to: './mocks' },
            ]),
            ...REPLACEMENTS,
        ],
        devtool: 'source-map',
        devServer: {
            contentBase: path.resolve(__dirname, './dist'),
            index: './index.html',
            hot: true,
            // hotOnly: true,
            open: true,
            port: 8080,
            proxy: proxy,
        },
    };
};
