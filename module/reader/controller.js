'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, Url       = require('url')

	, config    = require('../../config.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, TagModel  = require('../tag/model.js')
	, User      = require('../user/user.js')

	, Model     = require('./model.js')
	, View      = require('./view.js')
	, Admin     = require('./admin.view.js')
	, ReaderError   = require('./error.js')

	, Reader    = require('./reader.js')

	, Promise = require('promise')
	;

// 注册首页 metro 模块
modules.register({
	id: 'reader'
	, metroSize: 'tiny'
	, title: '阅读 reader'
	, icon: 'reader'
	, href: 'reader/'
}, {
	id: 'bookmark'
	, metroSize: 'tiny'
	, title: '书签 bookmark'
	, icon: 'bookmark'
	, href: 'reader/bookmark'
}, {
	id: 'favorite'
	, metroSize: 'tiny'
	, title: '收藏 favorite'
	, icon: 'star'
	, href: 'reader/favorite'
});

web.get('/reader/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		, keyword = query.keyword || ''
		, tags = query.tags || ''
		, execute
		;

	if( keyword ){
		execute = Model.searchReaderByName(keyword, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countSearchReaderByName(keyword).then(function(count){
					return {
						data: rs
						, index: page
						, size: size
						, count: count
						, urlCallback: function(index){
							return '?keyword='+ keyword +'&page='+ index;
						}
					};
				});
			}
			else{
				result = {
					data: []
					, index: 1
					, size: size
					, count: 0
					, urlCallback: function(index){
						return '?keyword='+ keyword +'&page='+ index;
					}
				};
			}

			return result;
		});
	}
	else if( tags ){
		execute = Model.filterReaderByTag(tags, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countFilterReaderByTag(tags).then(function(count){
					return {
						data: rs
						, index: page
						, size: size
						, count: count
						, urlCallback: function(index){
							return '?tags='+ tags + '&page='+ index;
						}
					};
				});
			}
			else{
				result = {
					data: []
					, index: 1
					, size: size
					, count: 0
					, urlCallback: function(index){
						return '?tags='+ tags + '&page='+ index;
					}
				};
			}

			return result;
		});
	}
	else{
		execute = Model.getReaderByPage(page, size).then(function(rs){
			return Model.countReader().then(function(count){
				return {
					data: rs
					, index: page
					, size: size
					, count: count
					, urlCallback: function(index){
						return '?page='+ index;
					}
				}
			});
		});
	}

	execute.then( View.readerList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/reader/bookmark', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		, keyword = query.keyword || ''
		, tags = query.tags || ''
		, user = User.getUserFromSession.fromReq(req)
		, execute
		;
console.log(user);
	if( keyword ){
		execute = Model.searchBookmarkByTitle(user.id, keyword, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countSearchBookmarkByTitle(user.id, keyword).then(function(count){
					return {
						data: rs
						, index: page
						, size: size
						, count: count
						, urlCallback: function(index){
							return '?keyword='+ keyword +'&page='+ index;
						}
					};
				});
			}
			else{
				result = {
					data: []
					, index: 1
					, size: size
					, count: 0
					, urlCallback: function(index){
						return '?keyword='+ keyword +'&page='+ index;
					}
				};
			}

			return result;
		});
	}
	else if( tags ){
		execute = Model.filterBookmarkByTags(user.id, tags, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countFilterBookmarkByTags(user.id, tags).then(function(count){
					return {
						data: rs
						, index: page
						, size: size
						, count: count
						, urlCallback: function(index){
							return '?tags='+ tags + '&page='+ index;
						}
					};
				});
			}
			else{
				result = {
					data: []
					, index: 1
					, size: size
					, count: 0
					, urlCallback: function(index){
						return '?tags='+ tags + '&page='+ index;
					}
				};
			}

			return result;
		});
	}
	else{
		execute = Model.getBookmarkByPage(user.id, page, size).then(function(rs){
			return Model.countBookmark(user.id).then(function(count){
				return {
					data: rs
					, index: page
					, size: size
					, count: count
					, urlCallback: function(index){
						return '?page='+ index;
					}
				};
			});
		})
	}

	execute.then( View.bookmarkList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/reader/favorite', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		, keyword = query.keyword || ''
		, tags = query.tags || ''
		, user = User.getUserFromSession.fromReq(req)
		, execute
		;

	if( keyword ){
		execute = Model.searchFavoriteByTitle(user.id, keyword, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countSearchFavoriteByTitle(user.id, keyword).then(function(count){
					return {
						data: rs
						, index: page
						, size: size
						, count: count
						, urlCallback: function(index){
							return '?keyword='+ keyword +'&page='+ index;
						}
					};
				});
			}
			else{
				result = {
					data: []
					, index: 1
					, size: size
					, count: 0
					, urlCallback: function(index){
						return '?keyword='+ keyword +'&page='+ index;
					}
				};
			}

			return result;
		});
	}
	else if( tags ){
		execute = Model.filterFavoriteByTags(user.id, tags, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countFilterFavoriteByTags(user.id, tags).then(function(count){
					return {
						data: rs
						, index: page
						, size: size
						, count: count
						, urlCallback: function(index){
							return '?tags='+ tags + '&page='+ index;
						}
					};
				});
			}
			else{
				result = {
					data: []
					, index: 1
					, size: size
					, count: 0
					, urlCallback: function(index){
						return '?tags='+ tags + '&page='+ index;
					}
				};
			}

			return result;
		});
	}
	else{
		execute = Model.getFavoriteByPage(user.id, page, size).then(function(rs){
			return Model.countFavorite(user.id).then(function(count){
				return {
					data: rs
					, index: page
					, size: size
					, count: count
					, urlCallback: function(index){
						return '?page='+ index;
					}
				};
			});
		});
	}

	execute.catch(function(e){
		console.log(e);

		return [];
	}).then( View.favoriteList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

socket.register({
	reader: function(){}
	, 'reader/add': function(socket, data){
		var send = {
				topic: 'reader/add'
			}
			, query = data.query || {}
			, feed = query.feed
			, execute
			;

		query.tags = '';
		if( feed ){
			execute = Model.isExistReader( feed ).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					result = Promise.reject( new ReaderError('数据已存在') );
				}
				else{
					result = Model.addReader( query ).then(function(rs){
						var result;
						if( rs.insertId ){
							send.info = {
								id: rs.insertId
								, html_url: query.url
								, xml_url: query.feed
								, name: query.name
								, tags: query.tags
							};

							result = send;
						}
						else{
							result = Promise.reject( new ReaderError('数据已存在') );
						}

						return result;
					});
				}

				return result;
			});
		}
		else{
			execute = Promise.reject( new ReaderError('缺少参数') );
		}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, 'reader/feed': function(socket, data){
		var send = {
				topic: 'reader/feed'
			}
			, feed = data.query.feed
			, execute
			;

		if( feed ){
			execute = Reader.crawler( feed ).then( Reader.handleFeed ).then(function(rs){
				var datetime
					, today
					, type
					, y, m, d, h, mm, s
					, result
					;
				if( rs && rs.length ){
					datetime = rs[0].datetime;
					today = datetime ? datetime : new Date();
					type = typeof today;

					if( type === 'string' || type === 'number' ){
						today = new Date( datetime );
					}

					if( !(today instanceof Date) || today.toString() === 'Invalid Date' ){
						today = new Date();
					}

					y = today.getFullYear();
					m = today.getMonth() +1;
					d = today.getDate();
					h = today.getHours();
					mm = today.getMinutes();
					s = today.getSeconds();

					m = m < 10 ? '0' + m : m;
					d = d < 10 ? '0' + d : d;
					h = h < 10 ? '0' + h : h;
					mm = mm < 10 ? '0' + mm : mm;
					s = s < 10 ? '0' + s : s;
					datetime = y +'-'+ m +'-'+ d +' '+ h +':'+ mm +':'+ s;

					// 更新最后发布时间 为异步操作 不关心结果
					Model.updateReaderPubById(datetime, data.query.id);

					result = rs;
				}
				else{
					result = Promise.reject( new ReaderError('数据分析失败') );
				}

				return result;
			}).then(function(rs){
				var result
					;

				if( rs ){
					send.info = {
						id: data.query.id
						, data: rs
					};

					result = send;
				}
				else{
					result = Promise.reject( new ReaderError('抓取数据失败') );
				}

				return result;
			});
		}
		else{
			execute = Promise.reject( new ReaderError('缺少参数') );
		}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, 'reader/search': function(socket, data){
		var send = {
				topic: 'reader/search'
			}
			, query = data.query || {}
			, keyword = query.keyword
			, page = query.page || 1
			, size = query.size || 20
			, execute
			;

		if( keyword ){
			execute = Model.searchReaderByName(keyword, page, size).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					send.data = rs;

					result = Model.countSearchReaderByName(keyword).then(function(count){
						send.count = count;

						return send;
					});
				}
				else{
					send.data = [];
					send.count = 0;

					result = send;
				}

				return result;
			});
		}
		else{
			execute = Promise.reject( new ReaderError('缺少参数') );
		}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}

	, 'reader/bookmark': function(){}
	, 'reader/bookmark/add': function(socket, data){
		var send = {
				topic: 'reader/bookmark/add'
			}
			, query = data.query || {}
			, url = query.url
			, targetId = query.targetId
			, title = query.title
			, tags = query.tags
			, source
			, user = User.getUserFromSession.fromSocket(socket)
			, execute
			, bookmark = {} //
			;

		console.log('bookmark add url: ' + url);

		// 检测 user
		//if( User.isGuest(user) ){
			if( url ){
				execute = Model.isExistBookmark(url, true)
					.then(function(rs){
					var result
						, bookmarkId
						;

					if( rs && rs.length ){  // reader_bookmark 表中已存在该 url
						bookmarkId = rs[0].id;

						// 在 user_reader_bookmark 表中查找该用户是否已有该 bookmark
						result = Model.isExistUserBookmark(bookmarkId, user.id, true).then(function(rs){
							var result
								;

							if( rs && rs.length ){  // user_reader_bookmark 表中已有数据
								result = rs[0];
								result.bookmarkId = bookmarkId;
								result.targetId = targetId;

								send.info = result;

								result = Promise.reject( new ReaderError('该文章已在您的书签中已存在') );
							}
							else{   // 没有该数据 添加
								result = {
									bookmarkId: bookmarkId
									, userId: user.id
									, title: title
									, tags: tags
									, score: 0
									, status: 0
								};
							}

							return result;
						}).then(function(data){
							return Model.addUserBookmark( data ).then(function(rs){
								var result;

								if( rs && rs.insertId ){
									data.id = rs.insertId;

									send.info = data;

									result = send;
								}
								else{
									result = Promise.reject( new ReaderError('数据保存失败') );
								}

								return result;
							});
						});
					}
					else{   // reader_bookmark 表中不存在该 url
						if( targetId ){ // 已有相关数据 添加到 reader_bookmark 表中
							source = Url.parse(url);
							source = source.protocol + '//' + source.host;

							result = Promise.resolve({
								url: url
								, title: title
								, source: source
								, tags: tags
								, userId: user.id
								, score: 0
								, status: 0
								, targetId: targetId
							});
						}
						else{   // 没有相关数据 抓取 整理数据
							result = Reader.crawler( url ).then( Reader.handleArticle ).then(function(data){
								var result
									;

								if( data ){
									data.userId = user.id;
									data.score = 0;
									data.status = 0;
									result = data;
								}
								else{
									result = Promise.reject( new ReaderError('抓取数据失败') );
								}

								return result;
							});
						}

						result = result.then(function(data){ // 添加到 reader_bookmark
							console.log(data);

							return Model.addBookmark({
								url: data.url
								, title: data.title
								, source: data.source
								, userId: data.userId
							}).then(function(rs){
								var result
									;

								if( rs && rs.insertId ){
									data.bookmarkId = rs.insertId;

									result = data;
								}
								else{
									result = Promise.reject( new ReaderError('保存失败') );
								}

								return result;
							});
						}).then(function(data){ // 添加到 user_reader_bookmark
							return Model.addUserBookmark( data ).then(function(rs){
								var result
									;

								if( rs && rs.insertId ){
									data.id = rs.insertId;

									result = data;
								}
								else{
									result = Promise.reject( new ReaderError('数据保存失败') );
								}

								return result;
							});
						}).then(function(data){ // 处理返回信息
							send.info = data;

							return send;
						});
					}

					return result;
				})
					//// 判断 reader_bookmark 表中是否有该 url
					//.then(function(bookmark){   // reader_bookmark 表中已有该 url
					//	return Promise.reject(bookmark);
					//}, function(){  // reader_bookmark 表中没有该 url
					//	if( targetId ){ // 已有相关数据
					//
					//	}
					//	else{   // 没有相关数据 抓取并整理
					//
					//	}
					//})
					//// 获取 url 对应数据
					//.then(function(){}, function(){
					//
					//})
					////
					//.then(function(){}, function(){})
				;
			}
			else{
				execute = Promise.reject( new ReaderError('缺少参数') );
			}
		//}
		//else{
		//	execute = Promise.reject( new ReaderError('用户尚未登录') );
		//}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, 'reader/bookmark/read': function(socket, data){
		var send = {
				topic: 'reader/bookmark/read'
			}
			, query = data.query
			, id = query.id
			, bookmarkId = query.bookmarkId
			, url = query.url
			, tags = query.tags || ''
			, score = query.score || 0
			, oldScore = query.oldScore || 0
			, oldStatus = query.oldStatus || 0
			, title = query.title || ''
			, user = User.getUserFromSession.fromSocket(socket)
			, bookmark
			, execute
			;

		// 检测 user
		//if( User.isGuest(user) ){
			// 判断是否已有 id
			if( id ){
				if( /^\d+$/.test( id ) ){
					// 合法数据库 id
					// user_reader_bookmark 表中已有数据 操作为更新数据
					// 更新 reader_bookmark 表 total_score num_reader 字段

					execute = Promise.all([
						Model.updateBookmarkRead(bookmarkId, title, score - oldScore, +oldStatus? 0 : 1)
						, Model.updateUserBookmarkRead(id, title, score, tags, 1, +oldStatus)
					]).then(function(rs){
						var r1 = rs[0]
							, r2 = rs[1]
							, result
							;

						if( r1 && r1.changedRows && r2 && r2.changedRows ){
							result = {
								id: id
								, bookmarkId: bookmarkId
								, userId: user.id
								, url: url
								, title: title
								, tags: tags
								, score: score
								, status: 1
							};
						}
						else{
							result = Promise.reject( new ReaderError('该文章已被读过') );
						}

						return result;
					}).then(function(data){
						send.info = data;

						return send;
					});
				}
				else if( url ){ // id 为 targetId，使用 url
					source = Url.parse(url);
					source = source.protocol + '//' + source.host;

					bookmark = {
						url: url
						, title: title
						, source: source
						, tags: tags
						, userId: user.id
						, score: score
						, status: 1
					};

					// 判断 reader_bookmark 表中是否存在该 url
					if( bookmarkId ){   // 已存在
						data.bookmarkId = bookmarkId;

						execute = Promise.resolve( bookmark );
					}
					else{   // 没有相关数据 添加到 reader_bookmark 表中
						execute = Model.addBookmark( bookmark ).then(function(rs){
							var result
								;

							if( rs && rs.insertId ){
								bookmark.bookmarkId = rs.insertId;

								result = bookmark;
							}
							else{
								result = Promise.reject( new ReaderError('保存失败') );
							}

							return result;
						});
					}

					execute = execute.then(function(bookmark){ // 添加到 user_reader_bookmark
						return Model.addUserBookmark( bookmark ).then(function(rs){
							var result
								;

							if( rs && rs.insertId ){
								data.id = rs.insertId;

								result = data;
							}
							else{
								result = Promise.reject( new ReaderError('数据保存失败') );
							}

							return result;
						});
					}).then(function(data){ // 处理返回信息
						send.info = data;

						return send;
					});
				}
				else{
					execute = Promise.reject( new ReaderError('缺少参数') );
				}
			}
			else{
				execute = Promise.reject( new ReaderError('缺少参数') );
			}
		//}
		//else{
		//	execute = Promise.reject( new ReaderError('用户尚未登录') );
		//}

		//Promise.all( tags.split(',').map(function(d){
		//	return TagModel.increaseByName(d, 1);
		//}) );

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, 'reader/bookmark/search': function(socket, data){
		var send = {
				topic: 'reader/bookmark/search'
			}
			, query = data.query || {}
			, keyword = query.keyword
			, page = query.page || 1
			, size = query.size || 20
			, execute
			;

		if( keyword ){
			execute = Model.searchBookmarkByTitle(keyword, page, size).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					send.data = rs;

					result = Model.countSearchBookmarkByTitle(keyword).then(function(count){
						send.count = count;

						return send;
					});
				}
				else{
					send.data = [];
					send.count = 0;

					result = send;
				}

				return result;
			});
		}
		else{
			execute = Promise.reject( new ReaderError('缺少参数') );
		}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, 'reader/bookmark/filter': function(){}

	, 'reader/favorite': function(){}
});