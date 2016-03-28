'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')
	, popup     = require('../emmet/popup.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, pagination    = require('../pagination.js')

	, documentList           = emmetTpl({
		template: getEmmet('admin/document/documentList.html')
	})
	, documentAddForm     = emmetTpl({
		template: getEmmet('admin/document/documentAddForm.html')
	})

	, sectionTpl        = emmetTpl({
		template: getEmmet('admin/document/section.html')
		, filter: {
			contentList: function(d){
				return contentListTpl( d.contentList ).join('');
			}
		}
	})
	, contentListTpl    = emmetTpl({
		template: getEmmet('admin/document/contentList.html')
	})
	, sectionAddFormTpl = emmetTpl({
		template: getEmmet('admin/document/sectionAddForm.html')
	})
	, contentAddFormTpl = emmetTpl({
		template: getEmmet('admin/document/contentAddForm.html')
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
							type: 'button', id: 'add', icon: 'plus', title: '添加'
						}]
						, content: '<ul>' + documentList(rs.data).join('') + '</ul>' + '<div class="pagination" id="pagination">'+ pagination(rs.index, rs.size, rs.count, rs.urlCallback) +'</div>'
					}
					, modulePopup: [{
						id: 'addPopup'
						, size: 'normal'
						, toolbar: ''
						, content: documentAddForm({}).join('')
						, button: '<button type="button" id="addData" class="btn btn-submit">添加</button>'
					}, popup.msgPopup]
				}
				, script: {
					main: '../../script/admin/document/list'
					, src: '../../script/lib/require.min.js'
				}
			})
		}
		, document: function(rs){
			var document = {
				title: '前端文档 Document'
				, stylesheet: [{
					path: '../../../style/style.css'}, {
					path: '../../../style/test.css'
				}]
				, main: {
					moduleMain: {
						id: 'document'
						, title: '前端文档 document'
						, size: 'large'
						, toolbar: [{
							type: 'button', id: 'save', icon: 'save', title: '保存排序'}, {
							type: 'button', id: 'add', icon: 'plus', title: '添加章节'}, {
							type: 'button', id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'
						}]
						, content: sectionTpl( rs ).join('')
					}
					, modulePopup: [{
						id: 'addSectionPopup'
						, size: 'normal'
						, toolbar: ''
						, content: sectionAddFormTpl({}).join('')
						, button: '<button type="button" id="addSection" class="btn btn-submit">添加</button>'
					}, {
						id: 'addContentPopup'
						, size: 'normal'
						, toolbar: ''
						, content: contentAddFormTpl({}).join('')
						, button: '<button type="button" id="addContent" class="btn btn-submit">添加</button>'
					}
					, popup.msgPopup
					]
				}
				, script: {
					main: '../../../script/admin/document/document'
					, src: '../../../script/lib/require.min.js'
				}
			};

			return tpl( document );
		}
	}
	;

module.exports = View;