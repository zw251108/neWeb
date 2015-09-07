'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, Model = require('./model.js')

	, articleTpl    = emmetTpl({
		template: 'article.article' +
			'>h3.article_title{%title%}' +
			'+div.article_content' +
				'>textarea[data-code-type=html]{%content%}' +
				'+button.btn.btn-submit[type=button]{保存}'
	})

	, View  = {
		article: function(rs){
			return tpl({
				title: '全部文章'
				, stylesheet: {
					path: '../../style/style.css'
				}
				, main: {
					moduleMain: {
						toolbar: [{
							type: 'button', id: 'add', icon: 'editor', title: '新建'
						}]
						, content: articleTpl(rs).join('')
					}
					, modulePopup: {
						id: 'addPopup'
						, size: 'normal'
						, toolbar: ''
						, content: '<form>' +
								'<div class="formGroup">' +
									'<label class="label" for="title">请添加标题</label>' +
									'<input type="text" id="title" class="input" name="title"/>' +
								'</div>' +
							'</form>'
						, button: '<button type="button" id="addData" class="btn">添加</button>'
					}
				}
				, script: {
					main: '../../script/admin/blog/article'
					, src: '../../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = View;