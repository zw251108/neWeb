'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, pagination    = require('../pagination.js')

	, tagView   = require('../tag/view.js')

	, articleListTpl = emmetTpl({
		template: getEmmet('blog/article.html')
		, filter: {
			tags: tagView.tagEditorFilter.tagsArea
		}
	})
	, articleTpl = emmetTpl({
		template: getEmmet('blog/articleDetail.html')
		, filter: {
			tags: tagView.tagEditorFilter.tagsArea
		}
	})

	, View = {
		blogList: function(rs){
			return tpl({
				title: '博客 blog'
				, main: {
					moduleMain: {
						id: 'blog'
						, title: '博客 blog'
						, content: articleListTpl( rs.data ).join('') + '<div class="pagination" id="pagination">'+ pagination(rs.index, rs.size, rs.count, rs.urlCallback) +'</div>'
					}
				}
				//, script: {
				//	main: '../script/module/blog/index'
				//	, src: '../script/lib/require.min.js'
				//}
			});
		}
		, blog: function(rs){
			return tpl({
				title: '博客 blog'
				, main: {
					moduleMain: {
						id: 'blog'
						, title: '博客 blog'
						, content : articleTpl( rs ).join('')
					}
				}
			})
		}
	}
	;

module.exports = View;