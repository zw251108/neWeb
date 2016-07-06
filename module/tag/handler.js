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

		// 缓存数据
		, TAG_CACHE: []
		, TAG_INDEX: {}

		, getTagList: function( user ){

			// todo 用户权限判断 获取相应标签
			return TagModel.getAll();
		}

		, newTag: function(user, data){
			var execute
				, name = data.name
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				if( name ){
					data.userId = user.id;

					execute = TagModel.add( data ).then(function(rs){
						var result
							;

						if( rs.insertId ){
							data.id = rs.insertId;
							result = data;
						}
						else{
							result = TagHandler.getError(name +' 标签创建失败');
						}

						return result;
					});
				}
				else{
					execute = TagHandler.getError('缺少参数 name');
				}
			}

			return execute;
		}
		, increaseTag: function(user, data){
			var execute
				, name  = data.name
				, num   = query.num || 1
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				if( name ){
					execute = TagModel.increaseByName({
						name: name
						, num: num
					}).then(function(rs){
						var result
							;

						if( rs && rs.changedRows ){
							result = {
								name: name
							};

							if( name in TagHandler.TAG_INDEX ){
								TagHandler.TAG_CACHE[TagHandler.TAG_INDEX[name]] += 1;
							}
							else{
								TagHandler.TAG_INDEX[name] = TagHandler.TAG_CACHE.push( 1 );
							}
						}
						else{
							result = TagHandler.getError('标签更新失败');
						}

						return result;
					})
				}
			}

			return execute;
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