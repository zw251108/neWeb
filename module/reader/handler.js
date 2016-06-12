'use strict';

var CONFIG = require('../../config.js')
	, ReaderModel = require('./model.js')
	, ReaderError   = require('./error.js')

	, UserError     = require('../user/error.js')
	, UserHandler   = require('../user/handler.js')

	, ReaderHandler = {
		getReaderList: function(user, query){
			var execute
				, page = query.page || 1
				, size = query.size || CONFIG.params.PAGE_SIZE
				, keyword = query.keyword || ''
				, tags = query.tags || ''
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = Promise.reject( new UserError('用户尚未登录') );
			}
			else{
				if( keyword ){
					execute = ReaderModel.searchReaderByName(keyword, page, size);
				}
				else if( tags ){
					execute = ReaderModel.filterReaderByTag(tags, page, size);
				}
				else{
					execute = ReaderModel.getReaderByPage(page, size);
				}

				execute.then(function(rs){
					var result
						;

					if( rs && rs.length ){
						result = rs;
					}
					else{
						result = Promise.reject({
							data: rs
							, index: page
							, size: size
							, count: 0
							, urlCallback: function(index){
								return '?keyword='+ keyword +'&page='+ index;
							}
						});
					}

					return result;
				}).then(function(rs){
					var execute
						, urlCallback
						;

					if( keyword ){
						execute = ReaderModel.countSearchReaderByName(keyword, page, size);
						urlCallback = function(index){
							return '?keyword='+ keyword +'&page='+ index;
						};
					}
					else if( tags ){
						execute = ReaderModel.countFilterReaderByTag(tags, page, size);
						urlCallback = function(index){
							return '?tags='+ tags +'&page='+ index;
						}
					}
					else{
						execute = ReaderModel.countReader(page, size);
						urlCallback = function(index){
							return '?page='+ index;
						}
					}

					return execute.then(function(count){
						return {
							data: rs
							, index: page
							, size: size
							, count: count
							, urlCallback: urlCallback
						};
					});
				}, function(rs){
					return rs;
				});
			}

			return execute;
		}

		, getBookmarkList: function(user, query){
			var execute
				, page = query.page || 1
				, size = query.size || CONFIG.params.PAGE_SIZE
				, keyword = query.keyword || ''
				, tags = query.tags || ''
				, url = query.url || ''
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = Promise.reject( new UserError('用户尚未登录') );
			}
			else{
				if( keyword ){
					execute = ReaderModel.searchBookmarkByTitle(keyword, page, size);
				}
				else if( tags ){
					execute = ReaderModel.filterBookmarkByTags(tags, page, size);
				}
				else if( url ){}
				else{
					execute = ReaderModel.getBookmarkByPage(page, size);
				}

				execute.then(function(rs){
					var result
						;

					if( rs && rs.length ){
						result = rs;
					}
					else{
						result = Promise.reject({
							data: rs
							, index: page
							, size: size
							, count: 0
							, urlCallback: function(index){
								return '?keyword='+ keyword +'&page='+ index;
							}
						});
					}

					return result;
				}).then(function(rs){
					var execute
						, urlCallback
						;

					if( keyword ){
						execute = ReaderModel.countSearchBookmarkByTitle(keyword, page, size);
						urlCallback = function(index){
							return '?keyword='+ keyword +'&page='+ index;
						};
					}
					else if( tags ){
						execute = ReaderModel.countFilterBookmarkByTags(tags, page, size);
						urlCallback = function(index){
							return '?tags='+ tags +'&page='+ index;
						}
					}
					else{
						execute = ReaderModel.countBookmark(page, size);
						urlCallback = function(index){
							return '?page='+ index;
						}
					}

					return execute.then(function(count){
						return {
							data: rs
							, index: page
							, size: size
							, count: count
							, urlCallback: urlCallback
						};
					});
				}, function(rs){
					return rs;
				});
			}

			return execute;
		}

		, getBookmarkReaderPerDay: function(user){
			return ReaderModel.statisticReadMarkByDate( user.id );
		}
	}
	;

module.exports = ReaderHandler;