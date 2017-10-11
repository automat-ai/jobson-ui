"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || "8090";

loaders.push({
	test: /\.scss$/,
	loaders: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
	exclude: ['node_modules']
});

module.exports = (env = {}) => {

	const API_PREFIX = env.API_PREFIX || "/api/";

	return {

		entry: [
			'react-hot-loader/patch',
			'./src/index.jsx', // your app's entry point
		],
		devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
		output: {
			publicPath: '/',
			path: path.join(__dirname, 'public'),
			filename: 'bundle.js'
		},
		resolve: {
			extensions: ['.js', '.jsx']
		},
		module: {
			loaders
		},
		devServer: {
			contentBase: "./public",
			// do not print bundle build stats
			noInfo: true,
			// enable HMR
			hot: true,
			// embed the webpack-dev-server runtime into the bundle
			inline: true,
			// serve index.html in place of 404 responses to allow HTML5 history
			historyApiFallback: true,
			port: PORT,
			host: HOST,
			proxy: {
				[API_PREFIX]: {
					target: "http://localhost:8080",
					pathRewrite: {
						["^" + API_PREFIX]: "/"
					},
					secure: false,
					ws: true
				}
			}
		},
		plugins: [
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.HotModuleReplacementPlugin(),
			new ExtractTextPlugin({
				filename: 'style.css',
				allChunks: true
			}),
			new DashboardPlugin(),
			new HtmlWebpackPlugin({
				template: './src/template.html',
				files: {
					css: ['style.css'],
					js: ["bundle.js"],
				}
			}),
			new webpack.DefinePlugin({
				API_PREFIX: JSON.stringify(API_PREFIX),
			}),
		]
	};
};
