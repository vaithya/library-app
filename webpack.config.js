const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = [
	{
		name: 'server',
		target: 'node', // in order to ignore built-in modules like path, fs, etc.
		context: __dirname + '/server',
		node: {
			// dont inject __dirname, leave it as global.__dirname
			// dirname is set to / by webpack.
			__dirname: false,
		},
		entry: [ 'babel-polyfill', './server.js' ], // with respect to the context
		output: {
			path: __dirname + '/dist',
			filename: 'server.js',
		},
		externals: [ nodeExternals() ], // in order to ignore all modules in node_modules folder
		module: {
			rules: [
				{
					test: /\.js?$/,
					exclude: /node_modules/,
					use: [ {
						loader: 'babel-loader',
						options: {
							presets: [ 'env' ],
							plugins: [ 'transform-object-rest-spread' ],
						},
					} ],
				},
			],
		},
	},
];
