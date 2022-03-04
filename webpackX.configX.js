// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const minimatch = require('minimatch');
const fs = require('fs/promises');
const { JSDOM } = require('jsdom');
const sass = require('sass');
const ts = require('typescript');

const { env } = process;
const { NODE_ENV } = env;
const production = NODE_ENV === 'production';
const { loader: stylesHandler } = MiniCssExtractPlugin;
const modes = {
    'prod': 'production',
    'qa': 'development',
    'dev': 'development',
    'mock': 'development',
};

function configure({ type, env }, config) {
    const { [type]: mode } = modes;
    var config = {
        ...config,
        mode,
    };
    
    console.log('LOG:', config.mode, type);
    return config;
}

module.exports = ({ type }, env) => configure({ production, type, env }, {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'index.html' }),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                { from: './favicon.ico', to: './' },
                { from: './**/*.vertex.html', context: 'src' },  // https://webpack.js.org/plugins/copy-webpack-plugin/#examples
                { from: './**/*.vertex.js', context: 'src' },
                { from: './**/*.vertex.ts', context: 'src' },
            ],
        }),
        function desass(...args) {
            this.hooks.done.tap('Test', function x(stats) {
                const { compilation } = stats;
                const { assetsInfo } = compilation;
                var assets = Array.from( assetsInfo.values() ).filter(filter)
                  , assets = assets.map( ({ sourceFilename }) => sourceFilename.replace('src', 'dist') )
                  ;
                
                function filter(asset) {
                    if (!asset) return false;
                    if (!asset.sourceFilename) return false;
                    const { copied, sourceFilename: path } = asset;
                    const vertecal = minimatch(path, 'src/**/*.vertex.+(ts|html)');
                    const eligible = (copied && vertecal);
                    
                    return eligible;
                }
                
                // console.log('?????????', compilation.builtModules);
                // console.log('?????????', compilation.emittedAssets);
                for (let key in compilation) console.log('?????????', key);
                ;(async function x(path, ...more) {
                    const ts = minimatch(path, 'dist/**/*.ts');
                    const html = minimatch(path, 'dist/**/*.html');
                    const namespaces = path.split('/');
                    const filename = namespaces.pop();
                    const name = filename.replace(/\.ts|\.html/i, '');
                    // const file = await fs.readFile(path, 'utf-8');
                    // const details = { path, filename, name, file };
                    
                    // console.log('?????????', path, ts, html, filename, name, file);
                    // if (html) processHTML(details);
                    // if (ts) processTS(details);
                    if (more.length) x(...more);
                })(...assets);
                
                function processHTML(details) {
                    const { path, filename, name, file } = details;
                    const { window } = new JSDOM(`<div id="harness"></div>`);
                    const { document } = window;
                    const harness = document.querySelector('#harness');
                    const styles = getStyles(file);
                    const { css } = sass.compileString(styles);
                    const data = { ...details, document, harness, script: null, style: null };
                    
                    function getStyles(innerHTML) {
                        const pattern = /(?:<style.*>)([\s\S]*)(?:<\/style>)/im;
                        const [ full, styles = '' ] = innerHTML.match(pattern) || [ ];
                        return styles;
                    }
                    
                    harness.innerHTML = file.replace(styles, `\n${css}\n`);
                    data.script = harness.querySelector('script');
                    data.style = harness.querySelector('style');
                    
                    return Promise.resolve(data)
                        .then(processHTMLScript)
                        .then( ({ path, harness }) => fs.writeFile(path, harness.innerHTML) )
                        ;
                }
                
                function processHTMLScript(details) {
                    if ( !details ) return Promise.resolve(details);
                    if ( !details.script ) return Promise.resolve(details);
                    if ( !details.script.hasAttribute('lang') || details.script.getAttribute('lang') !== 'ts' ) return Promise.resolve(details);
                    const { path, document, harness, script } = details;
                    const { body } = document;
                    const { innerHTML = '' } = script;
                    const lang = script.getAttribute('lang');
                    const compilerOptions = { module: ts.ModuleKind.ESNext };
                    const { outputText: js } = ts.transpileModule(innerHTML, { compilerOptions });
                    
                    script.innerHTML = `\n${js}\n`;
                    script.removeAttribute('lang');
                    return details;
                }
                
                function processTS(details) {
                    if ( !minimatch(details.path, '**/*.ts') ) console.log(details);
                    if ( !minimatch(details.path, '**/*.ts') ) return Promise.resolve(details);
                    const { path, filename, name, file } = details;
                    const compilerOptions = { module: ts.ModuleKind.ESNext };
                    const { outputText: js } = ts.transpileModule(file, { compilerOptions });
                    
                    return fs.writeFile(path, js);//.then( () => fs.rename(path, path.replace('.ts', '.js')) );
                }
                
                // console.log('@PLUGIN:DESASS', assets);
            });
        },
    ],
    module: {
        rules: [
            {
                test: /\.vertex\.html$/i,
                loader: './loaders/vertex',
                exclude: ['/node_modules/'],
            },
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
});
