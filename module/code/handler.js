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

		, getCodeList: function(user, query){
			var execute
				, page      = query.page || 1
				, size      = query.size || CONFIG.params.PAGE_SIZE
				, keyword   = query.keyword || ''
				, tags      = query.tags || ''
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				if( keyword ){
					execute = CodeModel.searchCodeByName(keyword, page, size);
				}
				else if( tags ){
					execute = CodeModel.filterCodeByTag(tags, page, size);
				}
				else{
					execute = CodeModel.getCodeByPage(page, size);
				}

				execute = Promise.all([execute, execute.then(function(rs){
					var result
						;

					if( rs.length ){
						if( keyword ){
							result = CodeModel.countSearchCodeByName( keyword );
						}
						else if( tags ){
							result = CodeModel.countFilterCodeByTag( tags );
						}
						else{
							result = CodeModel.countCode();
						}
					}
					else{
						result = 0;
					}

					return result;
				})]).then(function(all){
					return {
						data: all[0]
						, count: all[1]
						, index: page
						, size: size
					}
				});
			}

			return execute;
		}
		, getCode: function(user, query){
			var execute
				, id    = query.id
				, name  = query.name
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				if( name ){
					execute = CodeModel.getCodeByName( name );
				}
				else if( id && id !== '0' ){
					execute = CodeModel.getCodeById( id );
				}
				else if( id === '0' ){
					execute = {
						id: 0
						, js_lib: 'jquery/dist/jquery.js'
					};
				}
				else{
					execute = CodeHandler.getError('缺少参数');
				}
			}

			return execute;
		}

		, saveCode: function(user, data){
			var execute
				, id    = data.id
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				data.userId = user.id;

				if( id && id !== '0' ){
					execute = CodeHandler.updateCode(user, data);
				}
				else if( id === '0' ){
					execute = CodeHandler.newCode(user, data);
				}
				else{
					execute = CodeHandler.getError('缺少参数 id');
				}
			}

			return execute;
		}
		, newCode: function(user, data){
			var execute
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				data.userId = user.id;
				execute = CodeModel.addCode( data ).then(function(rs){
					var result
						;

					if( rs && rs.insertId ){
						data.id = rs.insertId;
						result = data;
					}
					else{
						result = CodeHandler.getError('code 保存失败');
					}

					return result;
				});
			}

			return execute;
		}
		, updateCode: function(user, data){
			var execute
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				data.userId = user.id;
				execute = CodeModel.updateCode( data ).then(function(rs){
					var result
						;

					if( rs && rs.changedRows ){
						result = data;
					}
					else{
						result = CodeHandler.getError('code 保存失败');
					}

					return result;
				});
			}

			return execute;
		}

		, setMoreCode: function(user, data){
			var execute
				, imgId = data.imgId
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				data.userId = user.id;

				if( imgId ){   // 有图片更新
					execute = CodeHandler.updateMoreImgCode(user, data);
				}
				else{
					execute = CodeHandler.updateMoreCode(user, data);
				}
			}

			return execute;
		}
		, updateMoreCode: function(user, data){
			var execute
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				execute = CodeModel.updateCodeSet( data ).then(function(rs){
					var result
						;

					if( rs && rs.changedRows ){
						result = data;
					}
					else{
						result = CodeHandler.getError('code 保存失败');
					}

					return result;
				});
			}

			return execute;
		}
		, updateMoreImgCode: function(user, data){
			var execute
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				data.preview = data.src;

				execute = CodeModel.updateCodeSetImg( data ).then(function(rs){
					var result
						;

					if( rs && rs.changedRows ){
						result = data;
					}
					else{
						result = CodeHandler.getError('code 保存失败');
					}

					return result;
				});
			}

			return execute;
		}
	}
	;

module.exports = CodeHandler;