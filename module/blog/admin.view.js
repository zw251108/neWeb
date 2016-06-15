'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')
	, popup     = require('../emmet/popup.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, pagination    = require('../pagination.js')

	, Tools     = require('../tools.js')
	, TagView   = require('../tag/view.js')

	, articleListTpl    = emmetTpl({
		template: getEmmet('admin/blog/articleList.html')
		, filter: {
			tags: TagView.tagEditorFilter.tagsArea
		}
	})

	, articleFilter     = Tools.extend({
		content: Tools.encodeHTML
	}, TagView.tagEditorFilter)
	, articleTpl        = emmetTpl({
		template: getEmmet('admin/blog/article.html') +
			'+' + TagView.tagEditorEmmet
		, filter: articleFilter
	})
	, articleAddFormTpl = emmetTpl({
		template: getEmmet('admin/blog/articleAddForm.html')
	})

	, BlogAdminView  = {
		blogList: function(rs){
			return tpl({
				title: '文章'
				, stylesheet: {
					path: '../../style/style.css'
				}
				, main: {
					moduleMain: {
						id: 'blog'
						, icon: 'edit'
						, title: '博客 blog'
						, toolbar: [{
							type: 'button', id: 'add', icon: 'plus', title: '新建'
						}]
						, content: articleListTpl(rs.data).join('') + '<div class="pagination" id="pagination">'+ pagination(rs.index, rs.size, rs.count, rs.urlCallback) +'</div>'
					}
					, modulePopup: {
						id: 'addPopup'
						, size: 'normal'
						, toolbar: ''
						, content: articleAddFormTpl({}).join('')
						, button: '<button type="button" id="addData" class="btn btn-submit">添加</button>'
					}
				}
				, script: {
					main: '../../script/admin/blog/list'
					, src: '../../script/lib/require.min.js'
				}
			});
		}
		, blog: function(rs){
			return tpl({
				title: '文章'
				, stylesheet: {
					path: '../../../style/style.css'
				}
				, style: {
					style: 'input#title{width: 100%;border: 1px solid transparent;font-size: 24px;line-height: 1.5;text-indent: 0.5em;}input#title:focus {border-color: #888;}'
				}
				, main: {
					moduleMain: {
						id: 'blog'
						, icon: 'edit'
						, title: '博客 blog'
						, toolbar: [{
							type: 'button', id: 'save', icon: 'save', title: '保存'}, {
							type: 'button', id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'
						}]
						, content: articleTpl(rs).join('')
					}
					, modulePopup: [
						popup.msgPopup
					]
				}
				, script: {
					main: '../../../script/admin/blog/article'
					, src: '../../../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = BlogAdminView;