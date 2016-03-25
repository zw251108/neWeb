'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')
	, popup     = require('../emmet/popup.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, pagination    = require('../pagination.js')

	, docList           = emmetTpl({
		template: 'li.article[data-id=%id%]' +
		'>a[href=./%id%/]' +
		'>h3.article_title' +
		'>span.icon.icon-edit{ }' +
		'+{%title%}'
	})
	, docAddFormTpl     = emmetTpl({
		template: 'form#newDoc[method=post action=./]' +
			'>div.formGroup' +
				'>label.label[for=title]{请添加标题}' +
				'+input#title.input[type=text name=title data-validator=title]'
	})

	, sectionTpl        = emmetTpl({
		template: 'section.document_section.section[data-section-id=%sectionId%]' +
			'>h3.section_title{%sectionTitle%}' +
				'>button.icon.icon-plus[type=button title=添加章节]' +
				'+button.icon.icon-up[type=button title=上移]' +
				'+button.icon.icon-down[type=button title=下移]' +
				'+button.icon.icon-save[type=button title=保存排序]' +
			'^dl{%sectionList%}'
		, filter: {
			sectionList: function(d){
				return sectionListTpl( d.sectionList ).join('');
			}
		}
	})
	, sectionListTpl    = emmetTpl({
		template: 'dt.icon.icon-right[data-content-id=%id%]{%title%}' +
				'>button.icon.icon-up[type=button title=上移]' +
				'+button.icon.icon-down[type=button title=下移]' +
			'^dd' +
				'>textarea[data-code-type=html]{%content%}' +
				'+button.btn.btn-submit[type=button]{保存}'
	})
	, sectionAddFormTpl = emmetTpl({
		template: 'form#newSection[method=post action=./]' +
			'>input#documentId[type=hidden name=documentId]' +
			'+div.formGroup' +
				'>label.label[for=newSectionTitle]{请添加标题}' +
				'+input#newSectionTitle.input[type=text name=newSectionTitle]'
	})
	, contentAddFormTpl = emmetTpl({
		template: 'form#newContent[method=post action=./]' +
			'>input#sectionId[type=hidden name=sectionId]' +
			'+input#sectionTitle[type=hidden name=sectionTitle]' +
			'+div.formGroup' +
				'>label.label[for=contentTitle]{请添加标题}' +
				'+input#contentTitle.input[type=text name=contentTitle]'
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
						, content: '<ul>' + docList(rs.data).join('') + '</ul>' + '<div class="pagination" id="pagination">'+ pagination(rs.index, rs.size, rs.count, rs.urlCallback) +'</div>'
					}
					, modulePopup: [{
						id: 'addPopup'
						, size: 'normal'
						, toolbar: ''
						, content: docAddFormTpl({}).join('')
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