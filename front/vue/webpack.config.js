const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

let DEMO = process.env.DEMO;
if (!DEMO) {
    DEMO = 'no';
}
const NOT_DEMO_IGNORE = process.env.DEMO === 'demo' ? null : 'zn.json';
const DEMO_IGNORE = process.env.DEMO === 'demo' ? '.*' : '**/*';
let VERSION = process.env.VERSION;
let ENV = NODE_ENV = process.env.NODE_ENV;
if (!ENV) {
    ENV = 'production';
}
let DEST = process.env.DEST;
if (!DEST) {
    DEST = 'build';
}

const setPath = function (folderName) {
    return path.join(__dirname, folderName);
};

const buildingForLocal = () => {
    return (NODE_ENV === 'development');
};

const setPublicPath = () => {
    // let env = NODE_ENV;
    // if (env === 'production') {
    //     return 'https://your-directory/production/';
    // } else {
    return '';
    // }
};

const extractHTML = new HtmlWebpackPlugin({
    title: 'History Search',
    filename: 'index.html',
    inject: true,
    template: setPath('/src/tpl/tpl.ejs'),
    minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        removeComments: true,
        removeEmptyAttributes: true
    },
    environment: process.env.NODE_ENV,
    isLocalBuild: buildingForLocal(),
    imgPath: (!buildingForLocal()) ? 'assets' : 'src/assets'
});

const config = new Promise(function (resolve) {

    const pomParser = require("pom-parser");
    pomParser.parse({
        filePath: __dirname + "/pom.xml", // The path to a pom file
    }, function (err, pomResponse) {
        if (err) {
            console.log("Error while parsing pom: " + err);
            process.exit(1);
        }
        VERSION = pomResponse.pomObject.project.parent.version;

        console.log('>> build [version=' + VERSION + ', env=' + ENV + ', dest=' + DEST + ', demo=' + DEMO + ']');

        // resolve config object
        resolve({
            entry: {
                build: path.join(setPath('src'), 'index.js'),
            },
            output: {
                path: buildingForLocal() ? path.resolve(__dirname) : setPath(DEST),
                publicPath: setPublicPath(),
                filename: buildingForLocal() ? 'js/[name].js' : 'js/[name].[hash].js'
            },

            optimization: {
                runtimeChunk: false,
                splitChunks: {
                    chunks: "all"
                }
            },
            resolveLoader: {
                modules: [setPath('node_modules')]
            },
            mode: buildingForLocal() ? 'development' : 'production',
            devServer: {
                historyApiFallback: true,
                noInfo: false,
                port: 3000,
                proxy: {
                    '/api/*': {
                        target: 'http://localhost:8080/',
                        changeOrigin: true
                    },
                    '/actuator/*': {
                        target: 'http://localhost:8080/',
                        changeOrigin: true
                    }
                }
            },
            plugins: [
                extractHTML,
                new MiniCssExtractPlugin({
                    filename: "css/styles.[hash].css",
                    chunkFilename: "[id].css"
                }),
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production'),
                    'version': JSON.stringify(VERSION),
                    'env': JSON.stringify(ENV),
                    'demo': JSON.stringify(DEMO)
                }),
                new CopyWebpackPlugin([
                    {
                        from: path.resolve(__dirname, 'src/assets'),
                        to: '',
                        ignore: [NOT_DEMO_IGNORE]
                    },
                    {
                        from: path.resolve(__dirname, '../demo'), to: '',
                        ignore: [DEMO_IGNORE]
                    }
                ])
            ],
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                js: 'babel-loader'
                            }
                        }
                    },
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: [{
                            loader: "babel-loader",
                            options: {presets: ['es2015']}
                        }]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            "css-loader"
                        ]
                    },
                    {
                        test: /\.scss$/,
                        use: !buildingForLocal() ?
                            [
                                MiniCssExtractPlugin.loader,
                                "css-loader", 'sass-loader'
                            ] :
                            [{
                                loader: "style-loader" // creates style nodes from JS strings
                            }, {
                                loader: "css-loader" // translates CSS into CommonJS
                            }, {
                                loader: "sass-loader" // compiles Sass to CSS
                            }]
                    },
                    //{
                    //    test: /\.svg$/,
                    //    loader: 'svg-sprite-loader'
                    //},
                    {
                        test: /\.(png|jpg|gif)$/,
                        loader: 'file-loader',
                        query: {
                            name: '[name].[ext]?[hash]',
                            useRelativePath: buildingForLocal()
                        }
                    },
                    {
                        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
                        loader: 'url-loader?limit=100000&name=[name].[ext]'
                    }
                ]
            },
        })
    });
});

module.exports = config;
