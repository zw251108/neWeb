'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, pagination    = require('../pagination.js')

	, articleTpl = emmetTpl({
		template: getEmmet('blog/article.html')
		, filter: {
			tags: function(d){
				return d.tags ? d.tags.split(',').map(function(d){
					return '<span class="tag tag-checked">' + d +'</span>';
				}).join('') : '';
			}
		}
	})
	, articleDetailTpl = emmetTpl({
		template: getEmmet('blog/articleDetail.html')
		, filter: {
			tags: function(d){
				return d.tags ? d.tags.split(',').map(function(d){
					return '<span class="tag tag-checked">' + d +'</span>';
				}).join('') : '';
			}
		}
	})

	, View = {
		blog: function(rs){
			return tpl({
				title: '博客 blog'
				, main: {
					moduleMain: {
						id: 'blog'
						, title: '博客 blog'
						, content: articleTpl( rs.data ).join('') + '<div class="pagination">'+ pagination(rs.index, rs.size, rs.count, rs.urlCallback) +'</div>'
					}
				}
				//, script: {
				//	main: '../script/module/blog/index'
				//	, src: '../script/lib/require.min.js'
				//}
			});
		}
		, blogDetail: function(rs){
			return tpl({
				title: '博客 blog'
				, main: {
					moduleMain: {
						id: 'blog'
						, title: '博客 blog'
						, content : articleDetailTpl( rs ).join('')
					}
				}
			})
		}
	}
	;

module.exports = View;