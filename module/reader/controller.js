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
	;

// 注册首页 metro 模块
index.push({
	id: 'reader'
	, type: 'metro'
	, size: 'tiny'
	, title: '阅读 reader'
}, {
	id: 'reader/bookmark'
	, type: 'metro'
	, size: 'tiny'
	, title: '书签 bookmark'
});

web.get('/reader/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getReaderByPage(page, size).then(function(rs){
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
	}).then( View.readerList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/reader/bookmark', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getBookmarkByPage(page, size).then(function(rs){
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
	}).then( View.bookmarkList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/reader/favorite', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getFavoriteByPage(page, size).then(function(rs){
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
	}).then( View.favoriteList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

socket.register({
	reader: function(socket, data){

	}
	, 'reader/add': function(socket, data){}
	, 'reader/feed': function(socket, data){
		var send = {
				topic: 'reader/feed'
			}
			, feed = data.query.feed
			;

		if( feed ){
			Reader.crawler( feed ).then( Reader.handleFeed ).then(function(rs){
				var result
					, datetime
					, today
					, type
					, y, m, d, h, mm, s
					;
				if( rs.length ){
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

					// 更新最后发布时间
					result = Model.updateReaderPubById(datetime, data.query.id).then(function(r){
						return rs;
					});
				}
				else{
					result = Promise.reject( new ReaderError('数据分析失败') );
				}

				return result;
			}).then(function(rs){
				if( rs ){
					send.info = {
						id: data.query.id
						, data: rs
					};
				}
				else{
					send.error = '';
					send.msg = '抓取失败';
				}

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
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
						send.error = '';
						send.msg = '数据已存在';
						send.info = rs[0];
						send.info.id = rs[0].Id;
						send.info.targetId = targetId;

						socket.emit('data', send);

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
						send.error = '';
						send.msg = '数据已存在';
						send.info = rs[0];
						send.info = rs[0].Id;
						send.info.targetId = targetId;

						socket.emit('data', send);

						result = Promise.reject( new ReaderError('数据已存在') );
					}
					else{
						result = Reader.crawler( url );
					}

					return result;
				}).then( Reader.handleArticle );
			}

			execute.then(function( data ){
				var result;

				if( !data ){
					send.error = '';
					send.msg = '数据缺失';

					socket.emit('data', send);

					result = Promise.reject( new ReaderError('数据获取失败') );
				}
				else{
					data.status = 0;
					dataAll = data;

					result = Model.addBookmark( data );
				}

				return result;
			}).then(function(rs){
				dataAll.targetId = targetId;

				if( rs.insertId ){
					dataAll.id = rs.insertId;
					dataAll.sstatus = 0;
				}
				else{
					send.error = '';
					send.msg = '数据已存在';
				}
				send.info = dataAll;

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
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
			, result
			;

		// 判断是否已有 id
		if( id ){
			if( /^\d+$/.test( id ) ){   // 合法数据库 id
				// 更新为 已读 状态
				result = Model.updateBookmarkRead(id, title, score, tags).then(function(rs){

					send.info = {
						id: id
					};

					if( !rs.changedRows ){
						send.error = '';
						send.msg = '该文章已被读过';
					}

					return send;
				});
			}
			else if( url ){ // id 为 targetId，使用 url
				// 判断数据库是否已存在
				result = Model.isExistBookmark(url).then(function(rs){
					var p, source;

					if( rs && rs.length ){  // 已存在
						console.log('url ', url, '已存在');

						send.info = {
							id: rs[0].Id
						};

						// 更新为 已读 状态
						p = Model.updateBookmarkRead(id, title, score, tags).then(function(rs){

							if( !rs.changedRows ){
								send.error = '';
								send.msg = '该文章已被读过';
							}

							return send;
						});
					}
					else{   // 不存在
						source = Url.parse(url);
						source = source.protocol + '//' + source.host;

						// 保存到数据库
						p = Model.addBookmark({
							url: url
							, title: title
							, score: score
							, tags: tags
							, source: source
							, status: 2
						}).then(function(rs){

							if( rs.insertId ){
								send.info = {
									id: rs.insertId
									, targetId: id
									, tags: tags
								};
							}
							else{
								send.error = '';
								send.msg = '数据已存在';
							}

							return send;
						});
					}

					return p;
				});
			}
			else{
				send.error = '';
				send.msg = '缺少参数';

				result = Promise.resolve( send );
			}
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			result = Promise.resolve( send );
		}

		result.then(function(send){
			socket.emit('data', send);
		});
	}

	, 'reader/bookmark': function(socket, data){}
	, 'reader/bookmark/add': function(socket, data){
		var send = {
				topic: 'reader/bookmark/add'
			}
			, url = data.query.url
			, dataAll
			, result
			;

		if( url ){
			result = Model.isExistBookmark( url ).then(function(rs){
				var next;

				if( rs && rs.length ){
					//send.error = '';
					//send.msg = '数据已存在';

					next = Promise.reject( new ReaderError('数据已存在') );
				}
				else{
					next = Model
				}

				return next;
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			result = Promise.resolve( send );
		}

		result.then(function(send){
			socket.emit('data', send);
		});
	}

	, 'reader/favorite': function(socket, data){

	}
});