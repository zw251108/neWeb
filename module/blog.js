'use strict';

var db          = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, metro     = require('./metro.js')

	, tpl           = require('./emmetTpl/tpl.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, articleTpl    = emmetTpl({
		template:'article#blogArt%Id%.article>a[href=detail?id=%Id%]>h3.article_title{%title%}' +
		'^hr+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
		, filter: {
			tags: function(d){
				//var data = []
				//	, tagsId = (d.tags_id || '').split(',')
				//	, tagsName = (d.tags_name || '').split(',')
				//	;
				//
				//$.each(tagsId, function(i, d){
				//	data.push({
				//		Id: d
				//		, name: tagsName[i]
				//	});
				//});
				//
				//return tagTpl(data).join('');

				return d.tags_name ? d.tags_name.split(',').map(function(d){
					return '<span class="tag">' + d +'</span>';
				}).join('') : '';
			}
		}
	})
	, articleDetailTpl = emmetTpl({
		template: 'article.article>h3.article_title{%title%}+div.article_content{%content%}+hr' +
		'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
		, filter: {
			tags: function(d){
				return d.tags_name ? d.tags_name.split(',').map(function(d){
					return '<span class="tag">' + d +'</span>';
				}).join('') : '';
			}
		}
	})

	/**
	 * @namespace   Blog
	 * */
	, Blog = {
		/**
		 * @namespace   Model
		 * @memberof    Blog
		 * @desc    业务相关 sql 语句集合
		 * */
		Model: {
			blog: 'select Id,title,datetime,tags_id,tags_name from blog where status=1 order by Id desc'
			, blogPage: 'select Id,title,datetime,tags_id,tags_name from blog where status=1 order by Id desc limit ?,?'
			, 'blogDetail': 'select Id,title,content,datetime,tags_id,tags_name from blog where Id=?'
		}

		/**
		 * @namespace   Handler
		 * @memberof    Blog
		 * @desc    数据处理方法集合
		 * */
		, Handler: {}

		/**
		 * @namespace   View
		 * @memberof    Blog
		 * @desc    视图模板集合
		 * */
		, View: {
			blog: function(rs){
				rs = rs.result;

				return tpl.html('module', {
					title: '博客 Blog'
					, modules: tpl.mainTpl({
						id: 'blog'
						, title: '博客 blog'
						, content: articleTpl(rs).join('')
					}).join('')
					, script: {
						main: '../script/module/blog/index'
						, src: '../script/lib/require.min.js'
					}
				});
			}
			, blogDetail: function(rs){
				rs = rs.result[0];

				return tpl.html('module', {
					title: '博客 Blog'
					, modules: tpl.mainTpl({
						id: 'blog'
						, size: 'large'
						, title: '博客 blog'
						, content: articleDetailTpl(rs).join('')
					}).join('')
					, script: {
						main: '../script/module/blog/index'
						, src: '../script/lib/require.min.js'
					}
				});
			}
		}
	}
	;

//metro.push({
//	id: 'blog'
//	, type: 'metro'
//	, size: 'small'
//	, title: '博客 blog'
//});

web.get('/blog/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	page = page < 1 ? 1 : page;
	size = size < 1 ? 20 : size;
	                                  console.log(123123)
	db.handle({
		sql: Blog.Model.blogPage
		, data: [(page -1) * size, page * size]
	}).then( Blog.View.blog ).then(function(html){
		res.send( html );
		res.end();
	});
});
web.get('/blog/detail', function(req, res){
	var id = req.query.id || ''
		;

	if( id ){
		db.handle({
			sql: Blog.Model.blogDetail
			, data: [id]
		}).then( Blog.View.blogDetail ).then(function(html){
			res.send( html );
			res.end();
		});
	}
	else{
		res.end();
	}
});

socket.register({
	blog: function(socket, data){
		var query = data.query || {}
			, page
			, size
			, handle = {}
			;

		if( 'page' in query ){
			page = query.page || 1;
			size = query.size || 20;

			page = page < 1 ? 1 : page;
			size = size < 1 ? 20 : size;

			handle.sql = Blog.Model.blogPage;
			handle.data = [(page -1)*size, page*size]
		}
		else{
			handle.sql = Blog.Model.blog;
		}

		db.handle( handle ).then(function(rs){
			rs = rs.result;

			socket.emit('data', {
				topic: 'blog'
				, data: rs
			});
		});
	}
	, 'blog/detail': function(socket, data){
		var send = {
				topic: 'blog/detail'
			}
			, id = data.query.id
			;

		if( id ){
			db.handle({
				sql: Blog.Model.blogDetail
				, data: [id]
			}).then(function(rs){
				rs = rs.result;

				send.info = rs[0];

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
});

module.exports = Blog;
//	function(web, db, socket, metro){
//	var blog = Blog;
//
//
//
//	socket.register({
//		blog: function(socket){
//			var index = blog.index;
//
//			db.query(index.sql, function(e, rs){
//				if( !e ){
//					socket.emit('data', {
//						topic: 'blog'
//						, data: rs
//					});
//				}
//				else{
//					socket.emit('data', {
//						error: ''
//						, msg: ''
//					});
//					console.log('\n', 'db', '\n', index.sql, '\n', e.message);
//				}
//			});
//		}
//		, 'blog/detail': function(socket, data){
//		    var id = data.query.id
//			    , detail = blog.detail
//			    ;
//
//			if( id ){
//				db.query(detail.sql, [id], function(e, rs){
//					if( !e ){
//						rs = detail.handler( rs );
//						socket.emit('data', {
//							topic: 'blog/detail'
//							, info: rs
//						});
//					}
//					else{
//						socket.emit('data', {
//							error: ''
//							, msg: ''
//						});
//						console.log('\n', 'db', '\n', detail.sql, '\n', e.message);
//					}
//				});
//			}
//			else{
//				socket.emit('data', {
//					error: ''
//					, msg: ''
//				});
//				console.log('\n', 'socket blog/detail', '\n', 'no id');
//			}
//		}
//	});
//
//	web.get('/admin/blog', function(req, res){  // 后台管理 blog 模块
//
//	});
//};