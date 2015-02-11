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

	, tpl           = require('./tpl.js').tpl
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template
	, header        = tpl('header')
	, footer        = tpl('footer')
	, moduleTpl     = emmetTpl({
		template: 'div.Container>section#%moduleId%.module.module-main.module-%moduleId%.large>div.module_content{%moduleContent%}'
	})
	, stylesheetTpl = emmetTpl({
		template: 'link[rel=stylesheet href=%path%]'
	})
	, styleTpl      = emmetTpl({
		template: 'style{%style%}'
	})
	, scriptTpl     = emmetTpl({
		template: 'script[data-main=%main% src=%require%]'
	})

	, articleTpl    = emmetTpl({
		template:'article#blogArt%Id%.article>a[href=detail?id=%Id%]>h3.article_title{%title%}' +
		'^hr+span.article_date{%datetime%}+div.tagsArea{%tags%}'
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
		'+span.article_date{%datetime%}+div.tagsArea{%tags%}'
		, filter: {

		}
	})
	;

module.exports = function(web, db, socket){
	var blog = Blog;

	web.get('/blog/', function(req, res){
		var index = blog.index;

		db.query(index.sql, function(e, rs){
			if( !e ){
				res.send(header.replace('%pageTitle%', '博客 Blog').replace('%style%', '') + moduleTpl([{
					moduleId: 'blog'
					, moduleContent: articleTpl(rs).join('')
				}]).join('') + footer);
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
					res.send(header.replace('%pageTitle%', '博客 Blog').replace('%style%', '') + moduleTpl([{
						moduleId: 'blog'
						, moduleContent: articleDetailTpl(rs).join('')
					}]).join('') + footer);
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