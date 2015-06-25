'use strict';

/**
 * @module  segment 自定义分词
 * */
var Segment = require('segment').Segment // 载入模块
	, segment = new Segment()   // 创建实例
	;

/**
 * 配置，可根据实际情况增删，详见 segment.useDefault() 方法
 * */
segment
	.use( require(__dirname +'/HtmlTagTokenizer.js') )  // 自定义 识别 HTML 标签

	// 载入识别模块，强制分割类单词识别，详见 lib/module 目录，或者是自定义模块的绝对路径
	.use('URLTokenizer')            // URL 识别
	.use('WildcardTokenizer')       // 通配符，必须在标点符号识别之前
	.use('PunctuationTokenizer')    // 标点符号识别
	.use('ForeignTokenizer')        // 外文字符、数字识别，必须在标点符号识别之后
	// 中文单词识别
	.use('DictTokenizer')           // 词典识别
	.use('ChsNameTokenizer')        // 人名识别，建议在词典识别之后

	// 优化模块
	.use('EmailOptimizer')          // 邮箱地址识别
	.use('ChsNameOptimizer')        // 人名识别优化
	.use('DictOptimizer')           // 词典识别优化
	.use('DatetimeOptimizer')       // 日期时间识别优化

	// 载入字典，详见 dicts 目录，或者是自定义字典文件的绝对路径
	//.loadDict(__dirname + '\\web.txt', 'Web', true)  // 自定义
	.loadDict('dict.txt')           // 盘古词典
	.loadDict('dict2.txt')          // 扩展词典（用于调整原盘古词典）
	.loadDict('names.txt')          // 常见名词、人名
	.loadDict('wildcard.txt', 'WILDCARD', true)   // 通配符
	;


module.exports = segment;

// test 开始分词
//console.log('\n', segment.doSegment('<a href="http://12311.com">http://www.baidu.com</a><p> http:// 前端工程师，http://www.baidu.com 有一个人 </p>这是一个基于Node.js的中文分词模块。互联网，Java'));