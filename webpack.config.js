'use strict';

// var path        = require('path')
// 	, webpack   = require('webpack')
// 	, HtmlWebpackPlugin = require('html-webpack-plugin')
//
// 	, ROOT_PATH     = path.resolve(__dirname)
// 	, APP_PATH      = path.resolve(ROOT_PATH, 'test')
// 	, BUILD_PATH    = path.resolve(ROOT_PATH, 'build')
// 	, TEM_PATH      = path.resolve(ROOT_PATH, 'template')
// 	;
//
// module.exports = {
// 	// // 项目文件夹
// 	// //entry: APP_PATH
// 	// entry: {
// 	// 	app: path.resolve(APP_PATH, 'index.js')
// 	// 	, mobile: path.resolve(APP_PATH, 'mobile.js')
// 	// 	, vendors: ['jquery']
// 	// }
// 	//
// 	// // 输出文件夹
// 	// , output: {
// 	// 	path: BUILD_PATH
// 	// 	//, filename: 'index.js'
// 	// 	//, filename: '[name].js'
// 	// 	, filename: '[name].[hash].js'
// 	// }
// 	//
// 	// // 启用 source-map
// 	// , devtool: 'eval-source-map'
// 	//
// 	// // 服务器
// 	// , devServer: {
// 	// 	historyApiFallback: true
// 	// 	, hot: true
// 	// 	, inline: true
// 	// 	, progress: true
// 	//
// 	// 	// 代理 api 服务器
// 	// 	, proxy: {
// 	// 		'/api/*': {
// 	// 			target: 'http://localhost:5000'
// 	// 			, secure: false
// 	// 		}
// 	// 	}
// 	// }
// 	//
// 	// , module: {
// 	// 	loaders: [{ // 样式处理 css-loader style-loader
// 	// 		test: /\.css$/
// 	// 		// loaders 是一个数组，包含要处理这些程序的loaders
// 	// 		// loaders 的处理顺序是从右到左的
// 	// 		, loaders: ['style', 'css']
// 	// 		, include: APP_PATH
// 	// 	}, {    // sass-loader
// 	// 		test: /\.scss$/
// 	// 		, loaders: ['sass']
// 	// 		, include: APP_PATH
// 	// 	}, {    // url-loader
// 	// 		test: /\.(png|jpg)$/
// 	// 		// limit 为图片大小限制，超过自动启用 base64 编码图片
// 	// 		, loader: 'url?limit=40000'
// 	// 	}, {    // babel-loader babel-preset-es2015
// 	// 		test: /\.jsx?$/
// 	// 		, loader: 'babel'
// 	// 		, include: APP_PATH
// 	// 		, query: {
// 	// 			presets: ['es2015']
// 	// 		}
// 	// 	}, {    // imports-loader
// 	// 		test: /\.jsx?$/
// 	// 		, include: APP_PATH
// 	// 		, loader: 'imports-loader'
// 	// 	}]
// 	// 	, preLoader: [{    // jshint-loader
// 	// 		test: /\.jsx?$/
// 	// 		, include: APP_PATH
// 	// 		, loader: 'jshint-loader'
// 	// 	}]
// 	// }
// 	//
// 	// , jshint: {
// 	// 	esnext: true
// 	// }
// 	//
// 	// // 插件
// 	// , plugins: [
// 	// 	// html-webpack-plugin
// 	// 	//new HtmlWebpackPlugin({
// 	// 	//	title: 'Hello World app'
// 	// 	//})
// 	// 	new HtmlWebpackPlugin({
// 	// 		title: 'Hello World app'
// 	// 		, template: path.resolve(TEM_PATH, 'index.html')
// 	// 		, filename: 'index.html'
// 	// 		// 插件要引用 entry 里面的哪个入口
// 	// 		, chunks: ['app', 'vendors']
// 	// 		// 把 script 插入标签里
// 	// 		, inject: 'body'
// 	// 	})
// 	// 	, new HtmlWebpackPlugin({
// 	// 		title: 'Hello Mobile app'
// 	// 		, template: path.resolve(TEM_PATH, 'mobile.html')
// 	// 		, filename: 'index.html'
// 	// 		, chunks: ['app', 'vendors']
// 	// 		, inject: 'body'
// 	// 	})
// 	// 	// 把全局变量插入到所有的代码中
// 	// 	, new webpack.ProvidePlugin({
// 	// 		$: 'jquery'
// 	// 		, jQuery: 'jquery'
// 	// 		, 'window.jQuery': 'jquery'
// 	// 	})
// 	// 	// 使用 uglifyJs 压缩 js
// 	// 	, new webpack.optimize.UglifyJsPlugin({
// 	// 		minimize: true
// 	// 	})
// 	// 	// 将入口文件的数组打包成 vendors.js
// 	// 	, new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
// 	// ]
//
// 	entry: {
// 		// index: path.resolve(ROOT_PATH, 'static/webpack-loader/src/index.js')
// 		index: path.resolve(ROOT_PATH, 'static/newFrameDemo/src/index.js')
// 		, sw: path.resolve(ROOT_PATH, 'src/lib/frame/worker/serviceWorker.js')
// 	}
// 	, output: {
// 		path: path.resolve(ROOT_PATH, 'static/newFrameDemo/dist')
// 		// path: path.resolve(ROOT_PATH, 'static/webpack-loader/dist')
// 		, filename: '[name].js'
// 	}
// 	// 启用 source-map
// 	, devtool: 'source-map'
// 	, module: {
// 		loaders: [{
// 		// 	test: /\.js$/
// 		// 	, loader: 'test-loader'
// 		// }, {    // 添加 调试文件
// 		// 	test: /\.js/
// 		// 	, loader: 'debug-loader'
// 			test: /\.jsx?$/,
// 			exclude: /node_modules/,
// 			loader: 'babel-loader'
// 			, plugins: [
// 				["transform-runtime", {
// 					"helpers": false,
// 					"polyfill": true,
// 					"regenerator": true
// 				}],
// 				'add-module-exports',
// 				'transform-es3-member-expression-literals',
// 				'transform-es3-property-literals',
// 			]
// 			, query: {
// 				presets: [
// 					'es2015'
// 				]
// 			}
// 		}]
// 	}
// 	, plugins: [
// 		new HtmlWebpackPlugin({
// 			title: 'Hello World app'
// 			, filename: 'index.html'
// 			, chunks: ['index']
// 			, inject: 'body'
// 		})
// 		// 使用 uglifyJs 压缩 js
// 		, new webpack.optimize.UglifyJsPlugin({
// 			minimize: true
// 		})
// 	]
//
// };

let webpack = require('webpack')
	, path = require('path')
	, compiler = require('vue-template-compiler')
	, HtmlWebpackPlugin = require('html-webpack-plugin')
	;

module.exports = {
	devtool: '#source-map',
	//插件项
	plugins: [
		// 提取公共文件
		new webpack.optimize.CommonsChunkPlugin({
			name: 'v'
		})
		, new HtmlWebpackPlugin({
			title: 'Hello Mobile app'
			, template: path.resolve(__dirname, 'tpl/index.html')
			, filename: 'index.html'
			, chunks: ['v', 'index']
			, inject: 'body'
		})
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	},
		// 	sourceMap: true
		// }) //压缩JS
		// ,
		// new webpack.ProvidePlugin({
		// 	$: 'jquery'
		// 	, jQuery: 'jquery'
		// 	, 'window.jQuery': 'jquery'
		//
		// })
		// ,
	],
	//页面入口文件配置
	entry: {
		v: ['jquery', 'vue', 'z']
		, index: [path.resolve(__dirname, 'src/app/index.js')]
	},
	//入口文件输出配置
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: 'js/[name].js'
	},
	module: {
		//加载器配置
		rules: [{
			test: /\.css$/,
			loader: 'style-loader!css-loader'
			// +
			// '!sass-loader'
		}, {
			test: /\.js$/,
			loader: 'babel-loader'
		}, {
			test: /\.scss$/,
			loader: 'style-loader!css-loader'
			// +
			// '!sass-loader?sourceMap'
		}, {
			test: /\.(png|jpg)$/,
			loader: 'url-loader?limit=8192'
		}, {
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					js: 'babel-loader',
					css: 'vue-style-loader!css-loader',
					// scss: 'style-loader!css-loader!sass-loader',
					// sass: 'style-loader!css-loader!sass-loader?indentedSyntax'
				}
			}
		}, {
			test: /\.json$/,
			loader: 'json-loader'
		}]
	},
	externals:{
		Vue:'vue'
		// , maple: 'maple'
		// , z: 'z'
		// , $: 'window.$'
		// , jquery: 'window.$'
	},
	resolve: {
		modules: ['node_modules', __dirname]
		, alias: {
			maple: path.resolve(__dirname, 'src/lib/maple/base.js'),
			z: path.resolve(__dirname, 'src/lib/z/index.js')
			, vue$: 'vue/dist/vue.common.js'
		}
	}
	
};