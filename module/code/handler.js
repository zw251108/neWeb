'use strict';

var CONFIG = require('../../config.js')

	, UserHandler = require('../user/handler.js')

	, CodeModel = require('./model.js')
	, CodeError = require('./error.js')
	, CodeHandler = {
		// 错误处理
		getError: function(msg){
			return Promise.reject( new CodeError(msg) );
		}

		, getCodeList: function(user, query){}
		, getCode: function(user, query){
			var execute
				, id = query.id
				, name = query.name
				;

			// todo 权限判断
			if( id && id !== '0' ){
				execute = CodeModel.getEditorById( id );
			}
			//else if( id === '0' ){
			//	execute = {
			//		html: ''
			//
			//	}
			//}
			else if( name ){
				execute = CodeModel.getEditorByName( name );
			}
			else{
				execute = CodeHandler.getError('缺少参数');
			}

			return execute
		}
	}
	;

module.exports = CodeHandler;