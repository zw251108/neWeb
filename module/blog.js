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

		db.query(index.sql, function(e, data){
			if( !e ){
				res.send(header.replace('%pageTitle%', '博客 Blog').replace('%style%', '') + moduleTpl([{
					moduleId: 'blog'
					, moduleContent: articleTpl(data).join('')
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
			db.query(detail.sql, [id], function(e, data){
				if( !e ){
					res.send(header.replace('%pageTitle%', '博客 Blog').replace('%style%', '') + moduleTpl([{
						moduleId: 'blog'
						, moduleContent: articleDetailTpl(data).join('')
					}]).join('') + footer);
				}
				else{
					console.log('\n', 'db', '\n', index.sql, '\n', e.message);
				}
				res.end();
			});
		}
		else{
			res.end();
		}
	});
};