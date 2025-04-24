import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob'; // Corrected named import for glob
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin'; // For CSS extraction
import ExtensionReloader from 'webpack-ext-reloader'; // Import the plugin
import TerserPlugin from 'terser-webpack-plugin';

import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

import pkg from 'webpack';
const { DefinePlugin } = pkg;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically find all JavaScript files in src/
const entries = glob.sync('./src/**/*.js', { ignore: ['./src/lib/trustmark/js/**/*.js'] }).reduce((entries, filePath) => {
    const fileName = path.relative('./src', filePath).replace('.js', '');
    console.log(`Adding entry: ${fileName} -> ${filePath}`);
    entries[fileName] = './' + filePath;
    return entries;
}, {});

export default (env, argv) => {
    const isProduction = argv.mode === 'production'; // Use mode passed from CLI

    return {
        mode: argv.mode || 'development', // Use mode passed from CLI or default to 'development'
        entry: {
            ...entries, // Dynamically add all JavaScript files as entry points
            'content/contentStyles': './src/content/contentStyles.css', // Include the CSS file as an entry point
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js', // Match the file structure in src/
            clean: true, // Automatically clean the output directory before each build
        },
        resolve: {
            extensions: ['.js', '.css'], // Add .css extension support
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules|src\/lib\/trustmark\/js\/deps/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
                {
                    test: /\.css$/, // Add rule for .css files
                    use: [
                        MiniCssExtractPlugin.loader, // Extract CSS into a separate file
                        'css-loader', // Resolves CSS imports
                    ],
                },
                {
                    test: /node_modules\/c2pa/,
                    sideEffects: true, // Prevent tree shaking of c2pa
                  },
            ],
        },
        plugins: [
            //new BundleAnalyzerPlugin(),
            new DefinePlugin({
                'process.env.LOG_LEVEL': JSON.stringify(isProduction ? 'WARN' : 'TRACE'),
              }),
            new MiniCssExtractPlugin({
                filename: '[name].css', // Output CSS files with the same name as the input
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: './src/manifest.json', to: 'manifest.json' },
                    { from: './src/assets', to: 'assets' },
                    { from: './src/popup/popup.html', to: 'popup/popup.html' },
                    { from: './src/popup/assets', to: 'popup/assets' },
                    { from: './src/offscreen/offscreen.html', to: 'offscreen/offscreen.html' },
                    { from: './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js', to: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js' },
                    { from: './node_modules/c2pa/dist/assets/wasm/toolkit_bg.wasm', to: 'node_modules/c2pa/dist/assets/wasm/toolkit_bg.wasm' },
                    { from: './node_modules/c2pa/dist/c2pa.worker.min.js', to: 'node_modules/c2pa/dist/c2pa.worker.min.js' }, 
                    { from: './src/lib/trustmark/models/*.onnx', to: 'lib/trustmark/models/[name][ext]' },
                    { from: './src/lib/trustmark/js', to: 'lib/trustmark/js' },
                ],
            }),
            new ExtensionReloader({
                manifest: path.resolve(__dirname, 'src/manifest.json'), // Path to your manifest.json
                entries: {
                    background: ['background/background'], // Name of your background script entry
                    contentScript: ['content/content'], // Name(s) of your content script entries
                    extensionPage: ['popup/popup'], // Name(s) of your extension page entries
                },
                reloadPage: !isProduction, // Enable live reload only in development
            }),
        ],
        devtool: isProduction ? false : 'source-map', // Use source maps only in development
        optimization: {
            usedExports: false, // Disable tree shaking
            minimize: isProduction, // Minify only in production
            minimizer: [
                // new TerserPlugin({
                //     extractComments: false, // Disable LICENSE.txt generation
                //     terserOptions: {
                //         keep_classnames: true, // Preserve class names
                //         keep_fnames: true, // Preserve function names
                //       },
                // }),
            ],
            //runtimeChunk: false, // Include the runtime in each entry point
        },
        watch: !isProduction, // Enable watch mode only in development
    };
};