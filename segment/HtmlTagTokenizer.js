'use strict';

/**
 * HTML 标签识别模块
 *
 * @author ZwB
 * */

var debug = console.log;

/**
 * 模块类型
 * */
exports.type = 'tokenizer';

/**
 * 模块初始化
 *
 * @param {Segment} segment 分词接口
 * */
exports.init = function( segment ){
	exports.segment = segment;
};

/**
 *
 * @param {Array} words 单词数组
 * @return {Array}
 * */
exports.split = function( words ){
	var ret = [];

	// todo

	return ret;
};