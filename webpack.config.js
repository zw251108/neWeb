var path = require('path')
	, HtmlWebpackPlugin = require('html-webpack-plugin')

	, ROOT_PATH = path.resolve(__dirname)
	, APP_PATH = path.resolve(ROOT_PATH, 'public/script')
	, BUILD_PATH = path.resolve(ROOT_PATH, 'build')
	;

module.exports = {
	// 项目文件夹
	entry: APP_PATH

	// 输出文件夹
	, output: {
		path: BUILD_PATH
		, filename: 'index.js'
	}

	// 服务器
	, devServer: {
		historyApiFallback: true
		, hot: true
		, inline: true
		, progress: true
	}

	, module: {
		loaders: [{
			test: /\.s?css$/
			// loaders 是一个数组，包含要处理这些程序的loaders
			// loaders 的处理顺序是从右到左的
			, loaders: ['style', 'css', 'sass']
			, include: path.resolve(ROOT_PATH, 'sass')
		}, {
			test: /\.(png|jpg)$/
			// limit 为图片大小限制，超过自动启用 base64 编码图片
			, loader: 'url?limit=40000'
		}, {
			test: /\.jsx?$/
			, loader: 'babel'
			, include: APP_PATH
			, query: {
				presets: ['es2015']
			}
		}]
	}

	// 插件
	, plugins: [new HtmlWebpackPlugin({
		title: 'Hello World app'
	})]
};