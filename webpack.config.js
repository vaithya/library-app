const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

let commonExtensions = ['.js'];
let commonEntries = [
	'babel-polyfill'
];
let commonRules = [
	{
		test: /\.js?$/,
		exclude: /node_modules/,
		use: [{
			loader: 'babel-loader',
			options: {
				presets: ['env']
			}
		}]
	}
];

module.exports = [
	{
		name: 'server',
		target: 'node', // in order to ignore built-in modules like path, fs, etc.
		context: __dirname + "/server",
		node: {
			// dont inject __dirname, leave it as global.__dirname
			__dirname: false
		},
		entry: commonEntries.concat(['./server.js']),
		output: {
			path: __dirname + "/dist",
			filename: "server.js"
		},
		externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
		resolve: { extensions: commonExtensions }
	}
];
