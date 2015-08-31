'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, Model = require('./model.js')

	, sectionTpl    = emmetTpl({
		template: getEmmet('document/section.html')
		, filter: {
			sectionList: function(d){
				return sectionListTpl( d.sectionList ).join('')
			}
		}
	})
	, sectionListTpl = emmetTpl({
		template: getEmmet('document/sectionList.html')
	})

	, View = {
		document: function(rs){
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