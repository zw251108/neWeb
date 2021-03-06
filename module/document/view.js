'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')
	, menu      = require('../menu.js')

	, articleTpl    = emmetTpl({
		template: getEmmet('document/article.html')
		, filter: {
			sectionList: function(d){
				return sectionTpl( d.sectionList ).join('')
			}
		}
	})
	, sectionTpl    = emmetTpl({
		template: getEmmet('document/section.html')
		, filter: {
			contentList: function(d, i){
				return contentTpl( d.contentList ).join('')
			}
		}
	})
	, contentTpl    = emmetTpl({
		template: getEmmet('document/content.html')
		, filter: {
			contentIndex: function(d, i){
				return i;
			}
		}
	})

	, DocumentView = {
		documentList: function(rs){}
		, document: function(rs){
			var document = {
				title: '文档 Document'
				, main: {
					moduleMain: {
						id: 'document'
						, title: '文档 document'
						, size: 'large'
						, toolbar: [{
							type: 'button', id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'
						}]
						, content: articleTpl( rs ).join('')
					}
				}
				, footer: {
					nav: menu.current('document')
				}
				, script: {
					main: '../script/module/document/index'
					, src: '../script/lib/require.min.js'
				}
			};

			return tpl( document );
		}
	}
	;

module.exports = DocumentView;