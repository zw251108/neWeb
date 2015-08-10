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
				, script: {
					main: '../script/module/document/index'
					, src: '../script/lib/require.min.js'
				}
				, main: {
					moduleMain: {
						id: 'document'
						, size: 'large'
						, content: sectionTpl( rs).join('')
					}
				}
			};

			return tpl( document );
		}
	}
	;

module.exports = View;