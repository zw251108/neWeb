'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')
	, menu      = require('../menu.js')

	, sectionTpl    = emmetTpl({
		template: getEmmet('document/section.html')
		, filter: {
			contentList: function(d){
				return contentListTpl( d.contentList ).join('')
			}
		}
	})
	, contentListTpl = emmetTpl({
		template: getEmmet('document/contentList.html')
	})

	, View = {
		documentList: function(rs){}
		, document: function(rs){
			var document = {
				title: '前端文档 Document'
				, main: {
					moduleMain: {
						id: 'document'
						, title: '前端文档 document'
						, size: 'large'
						, toolbar: [{
							type: 'button', id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'
						}]
						, content: sectionTpl( rs ).join('')
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

module.exports = View;