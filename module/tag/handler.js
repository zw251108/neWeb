'use strict';

var CONFIG = require('../../config.js')
	, UserHandler = require('../user/handler.js')

	, TagModel = require('./model.js')
	, TagError = require('./error.js')
	, TagHandler = {
		// 错误处理
		getError: function(msg){
			return Promise.reject( new TagError(msg) );
		}

		, TAG_CACHE: []
		, TAG_INDEX: {}

		, getTagList: function(){
			return TagModel.getAll();
		}
	}
	;

TagHandler.getTagList().then(function(rs){

	rs.reduce(function(all, d, i){
		all[d.name] = i;

		return all;
	}, TagHandler.TAG_INDEX);

	TagHandler.TAG_CACHE = rs;
});

module.exports = TagHandler;