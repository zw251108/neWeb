'use strict';

var Blog = {
		index: {
			sql: 'select Id,title,datetime,tags_id,tags_name from blog where status=1 order by Id desc'
		}
		, detail: {
			sql: 'select Id,title,content,datetime,tags_id,tags_name from blog where Id=?'
			, handler: function(rs){
				return rs[0];
			}
		}
	}

	, tpl           = require('./emmetTpl/tpl.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, articleTpl    = emmetTpl({
		template:'article#blogArt%Id%.article>a[href=detail?id=%Id%]>h3.article_title{%title%}' +
		'^hr+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
		, filter: {
			//tags: function(d){
			//	var data = []
			//		, tagsId = (d.tags_id || '').split(',')
			//		, tagsName = (d.tags_name || '').split(',')
			//		;
			//
			//	$.each(tagsId, function(i, d){
			//		data.push({
			//			Id: d
			//			, name: tagsName[i]
			//		});
			//	});
			//
			//	return tagTpl(data).join('');
			//}
		}
	})
	, articleDetailTpl = emmetTpl({
		template: 'article.article>h3.article_title{%title%}+div.article_content{%content%}+hr' +
		'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}+div.tagsArea{%tags%}'
		, filter: {

		}
	})
	;

module.exports = function(web, db, socket, metro){
	var blog = Blog;

	metro.push({
		id: 'blog'
		, type: 'metro'
		, size: 'small'
		, title: '博客 blog'
	});

	web.get('/blog/', function(req, res){
		var index = blog.index;

		db.query(index.sql, function(e, rs){
			if( !e ){
				res.send(tpl.html('module', {
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
				}) );
			}
			else{
				console.log('\n', 'db', '\n', index.sql, '\n', e.message);
			}
			res.end();
		});
	});
	web.get('/blog/detail', function(req, res){
		var id = req.query.id || ''
			, detail = blog.detail
			;
		if( id ){
			db.query(detail.sql, [id], function(e, rs){
				if( !e ){
					res.send(tpl.html('module', {
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
					}) );
				}
				else{
					console.log('\n', 'db', '\n', detail.sql, '\n', e.message);
				}
				res.end();
			});
		}
		else{
			res.end();
		}
	});

	socket.register({
		blog: function(socket){
			var index = blog.index;

			db.query(index.sql, function(e, rs){
				if( !e ){
					socket.emit('getData', {
						topic: 'blog'
						, data: rs
					});
				}
				else{
					socket.emit('getData', {
						error: ''
						, msg: ''
					});
					console.log('\n', 'db', '\n', index.sql, '\n', e.message);
				}
			});
		}
		, 'blog/detail': function(socket, data){
		    var id = data.query.id
			    , detail = blog.detail
			    ;

			if( id ){
				db.query(detail.sql, [id], function(e, rs){
					if( !e ){
						rs = detail.handler( rs );
						socket.emit('getData', {
							topic: 'blog/detail'
							, info: rs
						});
					}
					else{
						socket.emit('getData', {
							error: ''
							, msg: ''
						});
						console.log('\n', 'db', '\n', detail.sql, '\n', e.message);
					}
				});
			}
			else{
				socket.emit('getData', {
					error: ''
					, msg: ''
				});
				console.log('\n', 'socket blog/detail', '\n', 'no id');
			}
		}
	});

	web.get('/admin/blog', function(req, res){  // 后台管理 blog 模块

	});
};