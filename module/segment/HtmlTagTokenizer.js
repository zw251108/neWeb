'use strict';

/**
 * HTML 标签识别模块
 *
 * @author  ZwB
 * */

var debug = console.log;

/**
 * 模块类型
 * */
exports.type = 'tokenizer';

/**
 * 模块初始化
 *
 * @param   {Segment}   segment 分词接口
 * */
exports.init = function( segment ){
	exports.segment = segment;
};

/**
 * 对 HTML 标签进行分词
 *
 * @param   {Array} words 单词数组
 * @return  {Array}
 * */
exports.split = function( words ){
	var POSTAG = exports.segment.POSTAG
		, ret = []
		, i = 0
		, j = words.length
		, w
		, m, n, tag
		, lastc, lastWord
		, word
		, tagInfo
		;

	// 设置 分词类型
	POSTAG.TAG = 0x80000000;
	POSTAG.tag = 0x80000000;
	POSTAG.CHSNAME.TAG = 'html 标签';
	POSTAG.CHSNAME.tag = 'html 标签';

	for(; i < j; i++){
		word = words[i];
		w = String( word.w );

		// 已识别的词
		if( word.p > 0 ){
			ret.push( word );
			continue;
		}

		tagInfo = matchTag( w );

		// 未识别出 html 标签
		if( !tagInfo.length ){
			ret.push( word );
			continue;
		}

		lastc = 0;
		for(m = 0, n = tagInfo.length; m < n; m++){
			tag = tagInfo[m];

			if( tag.c > lastc ){
				ret.push({
					w: w.substr(lastc, tag.c - lastc)
				});
			}
			ret.push({
				w: tag.w
				, p: POSTAG.tag
			});
			lastc = tag.c + tag.w.length;
		}
		lastWord = tagInfo[n -1];
		if( lastWord.c + lastWord.w.length < w.length ){
			ret.push({
				w: w.substr(lastWord.c + lastWord.w.length)
			});
		}
	}
	return ret;
};

var tagExpr = /(<\w+.*?>|<\/\w+.*?>|<\w+.*?\/?>)/g;

/**
 * 匹配标签，返回相关信息
 *
 * @param   {string}    text    文本
 * @return  {array}     返回格式 {w: '完整的开始标签或结束标签', c: 开始位置}
 * */
function matchTag(text){
	var rs = []
		, t
		;

	while( t = tagExpr.exec(text) ){
		rs.push({
			w: t[1]
			, c: t.index
		});
	}

	return rs;
}