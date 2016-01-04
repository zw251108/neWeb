'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, pagination    = require('../pagination.js')

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
				return sectionListTpl( d.sectionList ).join('')
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
		template: 'form[method=post action=add]' +
			'>div.formGroup' +
				'>label.label[for=title]{请添加标题}' +
				'+input#title.input[type=text name=title data-validator=title]'
	})

	, docList           = emmetTpl({
		template: 'li.article[data-id=%id%]' +
			'>a[href=./%id%/]' +
				'>h3.article_title' +
					'>span.icon.icon-edit{ }' +
					'+{%title%}'
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
						, content: sectionAddFormTpl({}).join('')
						, button: '<button type="button" id="addData" class="btn btn-submit">添加</button>'
					}, {
						id: 'msgPopup'
						, size: 'small'
						, toolbar: ''
						, content: '<div class="msg" id="msgContent"></div>'
					}]
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
						id: 'addSectionPopup', size: 'normal', toolbar: ''
						, content: '<form>' +
								'<input type="hidden" name="documentId" id="documentId"/>' +
								'<div class="formGroup">' +
								'<label class="label" for="newSectionTitle">请添加标题</label>' +
								'<input type="text" id="newSectionTitle" class="input" name="newSectionTitle"/>' +
								'</div>' +
							'</form>'
						, button: '<button type="button" id="addSection" class="btn btn-submit">添加</button>'
					}, {
						id: 'addContentPopup', size: 'normal', toolbar: ''
						, content: '<form>' +
							'<input type="hidden" name="sectionId" id="sectionId"/>' +
							'<input type="hidden" id="sectionTitle"/>' +
							'<div class="formGroup">' +
								'<label class="label" for="contentTitle">请添加标题</label>' +
								'<input type="text" id="contentTitle" class="input" name="contentTitle"/>' +
							'</div>' +
						'</form>'
						, button: '<button type="button" id="addContent" class="btn btn-submit">添加</button>'
					}, {
						id: 'msgPopup', size: 'small', toolbar: ''
						, content: '<div class="msg" id="msgContent"></div>'
					}]
				}
				, script: {
					main: '../../../script/admin/document/document'
					, src: '../../../script/lib/require.min.js'
				}
			};

			return tpl( document );
		}

		//, sectionList: function(rs){
		//
		//	return tpl({
		//		title: '章节列表'
		//		, stylesheet: {
		//			path: '../../../style/style.css'
		//		}
		//		, main: {
		//			moduleMain: {
		//				toolbar: [{
		//					type: 'button', id: 'save', icon: 'save', title: '保存排序'}, {
		//					type: 'button', id: 'add', icon: 'plus', title: '添加'
		//				}]
		//				, content: '<ul>' + docList(rs).join('') + '</ul>'
		//			}
		//			, modulePopup: {
		//				id: 'addPopup'
		//				, size: 'normal'
		//				, toolbar: ''
		//				, content: '<form>' +
		//					'<div class="formGroup">' +
		//						'<label class="label" for="title">请添加标题</label>' +
		//						'<input type="text" id="title" class="input" name="title"/>' +
		//					'</div>' +
		//				'</form>'
		//				, button: '<button type="button" id="addData" class="btn">添加</button>'
		//			}
		//		}
		//		, script: {
		//			main: '../../../script/admin/list'
		//			, src: '../../../script/lib/require.min.js'
		//		}
		//	});
		//}
		//, contentList: function(rs){
		//	return tpl({
		//		title: '内容章节'
		//		, stylesheet: {
		//			path: '../../../../style/style.css'
		//		}
		//		, main: {
		//			moduleMain: {
		//				toolbar: [{
		//					type: 'button', id: 'save', icon: 'save', title: '保存排序'}, {
		//					type: 'button', id: 'add', icon: 'plus', title: '添加'
		//				}]
		//				, content: '<ul>' + docList(rs).join('') + '</ul>'
		//			}
		//			, modulePopup: {
		//				id: 'addPopup'
		//				, size: 'normal'
		//				, toolbar: ''
		//				, content: '<form>' +
		//					'<div class="formGroup">' +
		//						'<label class="label" for="title">请添加标题</label>' +
		//						'<input type="text" id="title" class="input" name="title"/>' +
		//					'</div>' +
		//				'</form>'
		//				, button: '<button type="button" id="addData" class="btn">添加</button>'
		//			}
		//		}
		//		, script: {
		//			main: '../../../../script/admin/list'
		//			, src: '../../../../script/lib/require.min.js'
		//		}
		//	});
		//}
		//, content: function(rs){
		//	return tpl({
		//		title: '内容'
		//		, stylesheet: {
		//			path: '../../../../../style/style.css'
		//		}
		//		, main: {
		//			moduleMain: {
		//				id: 'editor'
		//				, content: '<form>' +
		//					'<input type="hidden" id="id" name="id" value="' + rs.id + '"/>' +
		//					'<textarea id="content" name="content" class="hidden">' + rs.content + '</textarea>' +
		//					'<button class="btn" type="submit">保存</button>' +
		//				'</form>'
		//			}
		//		}
		//		, script: {
		//			main: '../../../../../script/admin/content'
		//			, src: '../../../../../script/lib/require.min.js'
		//		}
		//	});
		//}
	}
	;

module.exports = View;