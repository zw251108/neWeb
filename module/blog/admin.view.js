'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, Model = require('./model.js')

	, articleListTpl    = emmetTpl({
		template: 'article.article' +
			'>a[href=./%Id%/]' +
				'>h3.article_title{%title%}'
	})
	, articleTpl        = emmetTpl({
		template: 'form[action=./save method=post]' +
			'>article.article[data-id=%Id%]' +
				'>h3.article_title>input#title.input[type=text name=title value=%title%]' +
				'^div.article_content' +
					'>textarea.hidden[name=content data-code-type=html]{%content%}'
	})
	, articleAddFormTpl = emmetTpl({
		template: 'form[method=post action=./add]' +
			'>div.formGroup' +
				'>label.label[for=title]{请添加标题}' +
				'+input#title.input[type=text name=title data-validator=title]'
	})

	, View  = {
		list: function(rs){
			return tpl({
				title: '文章'
				, stylesheet: {
					path: '../../style/style.css'
				}
				, main: {
					moduleMain: {
						id: 'blog'
						, toolbar: [{
							type: 'button', id: 'add', icon: 'plus', title: '新建'
						}]
						, content: articleListTpl(rs).join('')
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
		, article: function(rs){
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
						, toolbar: [{
							type: 'button', id: 'save', icon: 'save', title: '保存'}, {
							type: 'button', id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'
						}]
						, content: articleTpl(rs).join('')
					}
					, modulePopup: [{

						id: 'msgPopup', size: 'small', toolbar: ''
						, content: '<div class="msg" id="msgContent"></div>'
					//}, {
					//	id: 'addPopup'
					//	, size: 'normal'
					//	, toolbar: ''
					//	, content: '<form>' +
					//			'<div class="formGroup">' +
					//				'<label class="label" for="title">请添加标题</label>' +
					//				'<input type="text" id="title" class="input" name="title"/>' +
					//			'</div>' +
					//		'</form>'
					//	, button: '<button type="button" id="addData" class="btn">添加</button>'
					}]
				}
				, script: {
					main: '../../../script/admin/blog/article'
					, src: '../../../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = View;