
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const { loader: stylesHandler } = MiniCssExtractPlugin;
const CWD = process.cwd();

export default {
    entry: './src/index.ts',
    output: {
        path: path.resolve(CWD, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'index.html' }),
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(ts)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
};
