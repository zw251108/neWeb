'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, Model = require('./model.js')

	, docList = emmetTpl({
		template: 'li[data-id=%Id%]' +
			'>span.icon.icon-edit' +
			'+span.icon.icon-up' +
			'+span.icon.icon-down' +
			'+a[href=%Id%/]{%title%}'
	})

	, View = {
		documentList: function(rs){

			return tpl({
				title: '全部文档'
				, stylesheet: {
					path: '../../style/style.css'
				}
				, main: {
					moduleMain: {
						toolbar: [{
							type: 'button', id: 'save', icon: 'save', title: '保存排序'}, {
							type: 'button', id: 'add', icon: 'plus', title: '添加'
						}]
						, content: '<ul>' + docList(rs).join('') + '</ul>'
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
					main: '../../script/admin/list'
					, src: '../../script/lib/require.min.js'
				}
			})
		}
		, sectionList: function(rs){

			return tpl({
				title: '章节列表'
				, stylesheet: {
					path: '../../../style/style.css'
				}
				, main: {
					moduleMain: {
						toolbar: [{
							type: 'button', id: 'save', icon: 'save', title: '保存排序'}, {
							type: 'button', id: 'add', icon: 'plus', title: '添加'
						}]
						, content: '<ul>' + docList(rs).join('') + '</ul>'
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
					main: '../../../script/admin/list'
					, src: '../../../script/lib/require.min.js'
				}
			});
		}
		, contentList: function(rs){
			return tpl({
				title: '内容章节'
				, stylesheet: {
					path: '../../../../style/style.css'
				}
				, main: {
					moduleMain: {
						toolbar: [{
							type: 'button', id: 'save', icon: 'save', title: '保存排序'}, {
							type: 'button', id: 'add', icon: 'plus', title: '添加'
						}]
						, content: '<ul>' + docList(rs).join('') + '</ul>'
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
					main: '../../../../script/admin/list'
					, src: '../../../../script/lib/require.min.js'
				}
			});
		}
		, content: function(rs){
			return tpl({
				title: '内容'
				, stylesheet: {
					path: '../../../../../style/style.css'
				}
				, main: {
					moduleMain: {
						id: 'editor'
						, content: '<form>' +
							'<input type="hidden" id="id" name="id" value="' + rs.Id + '"/>' +
							'<textarea id="content" name="content" class="hidden">' + rs.content + '</textarea>' +
							'<button class="btn" type="submit">保存</button>' +
						'</form>'
					}
				}
				, script: {
					main: '../../../../../script/admin/content'
					, src: '../../../../../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = View;