'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, menu      = require('../menu.js')
	, pagination    = require('../pagination.js')

	, tagView   = require('../tag/view.js')

	, articleListTpl = emmetTpl({
		template: getEmmet('blog/articleList.html')
		, filter: {
			tags: tagView.tagEditorFilter.tagsArea
		}
	})
	, articleTpl = emmetTpl({
		template: getEmmet('blog/article.html')
		, filter: {
			tags: tagView.tagEditorFilter.tagsArea
		}
	})

	, BlogView = {
		blogList: function(rs){
			//return {
			//	title: '博客 blog'
			//	, main: {
			//		moduleMain: {
			//			id: 'blog'
			//			, icon: 'edit'
			//			, title: '博客 blog'
			//			, content: articleListTpl( rs.data ).join('') + '<div class="pagination" id="pagination">'+ pagination(rs.index, rs.size, rs.count, rs.urlCallback) +'</div>'
			//		}
			//	}
			//	, script: {
			//		main: '../script/module/blog/index'
			//		, src: '../script/lib/require.min.js'
			//	}
			//};
			return tpl({
				title: '博客 blog'
				, main: {
					moduleMain: {
						id: 'blog'
						, icon: 'edit'
						, title: '博客 blog'
						, content: articleListTpl( rs.data ).join('') + '<div class="pagination" id="pagination">'+ pagination(rs.index, rs.size, rs.count, rs.urlCallback) +'</div>'
					}
				}
				, footer: {
					nav: menu.current('blog')
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
						, icon: 'edit'
						, title: '博客 blog'
						, toolbar: [{
							type: 'button', id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'
						}]
						, content: articleTpl(rs).join('')
					}
				}
				, script: {
					main: '../script/module/blog/blog'
					, src: '../script/lib/require.min.js'
				}
			})
			;
		}
	}
	;

module.exports = BlogView;