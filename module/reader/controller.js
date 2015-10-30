'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, Url       = require('url')

	, config    = require('../../config.js')

	, index     = require('../index.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')
	, ReaderError   = require('./error.js')

	, Reader    = require('./reader.js')

	, Promise = require('promise')
	;

// 注册首页 metro 模块
index.push({
	id: 'reader'
	, type: 'metro'
	, size: 'tiny'
	, title: '阅读 reader'
}, {
	id: 'bookmark'
	, href: 'reader/bookmark'
	, icon: 'bookmark'
	, type: 'metro'
	, size: 'tiny'
	, title: '书签 bookmark'
}, {
	id: 'favorite'
	, href: 'reader/favorite'
	, icon: 'star'
	, type: 'metro'
	, size: 'tiny'
	, title: '收藏 favorite'
});

web.get('/reader/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		, keyword = query.keyword || ''
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
		, execute
		;

	if( keyword ){
		execute = Model.searchBookmarkByTitle(keyword, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countSearchBookmarkByTitle(keyword).then(function(count){
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
	else{
		execute = Model.getBookmarkByPage(page, size).then(function(rs){
			return Model.countBookmark().then(function(count){
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
		, execute
		;

	if( keyword ){
		execute = Model.searchFavoriteByTitle(keyword, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countSearchFavoriteByTitle(keyword).then(function(count){
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
	else{
		execute = Model.getFavoriteByPage(page, size).then(function(rs){
			return Model.countFavorite().then(function(count){
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

	execute.catch(function(e){console.log(e)}).then( View.favoriteList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

socket.register({
	reader: function(socket, data){}
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
								Id: rs.insertId
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

	, 'reader/article/bookmark': function(socket, data){
		var send = {
				topic: 'reader/article/bookmark'
			}
			, query = data.query || {}
			, url = query.url
			, targetId = query.targetId
			, tags = query.tags
			, title = query.title
			, dataAll
			, execute = Model.isExistBookmark( url )
			;

		if( url && targetId ){
			if( tags && title ){
				execute = execute.then(function(rs){
					var source = Url.parse(url)
						, result
						;

					source = source.protocol + '//' + source.host;

					if( rs && rs.length ){  // 数据已存在

						// 设置数据
						send.info = rs[0];
						send.info.id = rs[0].Id;
						send.info.targetId = targetId;

						result = Promise.reject( new ReaderError('数据已存在') );
					}
					else{
						result = {
							url: url
							, title: title
							, tags: tags
							, source: source
						};
					}

					return result;
				});
			}
			else{
				execute = execute.then(function(rs){
					var result;

					if( rs && rs.length ){

						send.info = rs[0];
						send.info.id = rs[0].Id;
						send.info.targetId = targetId;

						result = Promise.reject( new ReaderError('数据已存在') );
					}
					else{
						result = Reader.crawler( url );
					}

					return result;
				}).then( Reader.handleArticle );
			}

			execute = execute.then(function( data ){
				var result
					;

				if( !data ){
					result = Promise.reject( new ReaderError('数据获取失败') );
				}
				else{
					data.status = 0;
					dataAll = data;

					result = Model.addBookmark( data );
				}

				return result;
			}).then(function(rs){
				var result
					;

				dataAll.targetId = targetId;

				send.info = dataAll;

				if( rs.insertId ){
					dataAll.id = rs.insertId;
					dataAll.sstatus = 0;

					result = send;
				}
				else{
					result = Promise.reject( new ReaderError('数据已存在') );
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
	, 'reader/read': function(socket, data){
		var send = {
				topic: 'reader/read'
			}
			, query = data.query
			, id = query.id
			, url = query.url
			, tags = query.tags || ''
			, score = query.score || 0
			, title = query.title || ''
			, execute
			;

		// 判断是否已有 id
		if( id ){
			if( /^\d+$/.test( id ) ){   // 合法数据库 id
				// 更新为 已读 状态
				execute = Model.updateBookmarkRead(id, title, score, tags).then(function(rs){
					var result
						;

					if( rs.changedRows ){
						send.info = {
							id: id
						};

						result = send;
					}
					else{
						result = Promise.reject( new ReaderError('该文章已被读过') );
					}

					return result;
				});
			}
			else if( url ){ // id 为 targetId，使用 url
				// 判断数据库是否已存在
				execute = Model.isExistBookmark(url).then(function(rs){
					var source
						, result
						;

					if( rs && rs.length ){  // 已存在
						console.log('url ', url, '已存在');

						send.info = {
							id: rs[0].Id
						};

						// 更新为 已读 状态
						result = Model.updateBookmarkRead(id, title, score, tags).then(function(rs){
							var result
								;

							if( rs.changedRows ){
								result = send;
							}
							else{
								result = Promise.reject( new ReaderError('该文章已被读过') );
							}

							return result;
						});
					}
					else{   // 不存在
						source = Url.parse(url);
						source = source.protocol + '//' + source.host;

						// 保存到数据库
						result = Model.addBookmark({
							url: url
							, title: title
							, score: score
							, tags: tags
							, source: source
							, status: 2
						}).then(function(rs){
							var result
								;

							if( rs.insertId ){
								send.info = {
									id: rs.insertId
									, targetId: id
									, tags: tags
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

	, 'reader/bookmark': function(socket, data){}
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
	, 'reader/bookmark/add': function(socket, data){
		var send = {
				topic: 'reader/bookmark/add'
			}
			, url = data.query.url
			, dataAll
			, execute
			;

		if( url ){
			execute = Model.isExistBookmark( url ).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					result = Promise.reject( new ReaderError('数据已存在') );
				}
				else{
					// todo
					result = Reader.crawler( url ).then( Reader.handleArticle ).then(function(data){
						var result
							;

						if( !data ){
							result = Promise.reject( new ReaderError('抓取数据失败') );
						}
						else{
							data.status = 0;
							dataAll = data;

							result = Model.addBookmark( data )
						}

						return result;
					}).then(function(rs){
						var result
							;

						if( rs.insertId ){
							dataAll.id = rs.insertId;
							dataAll.status = 0;

							send.info = dataAll;
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

	, 'reader/favorite': function(socket, data){}
});