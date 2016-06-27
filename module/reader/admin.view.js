'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')
	, popup     = require('../emmet/popup.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, pagination    = require('../pagination.js')

	, CodeHandler = require('../code/handler.js')

	, ReaderAdminView = {
		bookmark: function(){
			return CodeHandler.getCode(user, {
				name: 'admin/tag'
			}).then(function(rs){
				var code = {}
					;

				code.title = rs.name;

				code.stylesheet = rs.css_lib ? rs.css_lib.split(',').map(function(d){
					return {
						path: '../../lib/'+ d
					};
				}) : '';
				code.style = rs.css ? {
					style: rs.css
				} : '';

				code.header = '';
				code.main = rs.html ? {
					moduleMain: {
						content: rs.html
					}
				} : '';

				code.script = rs.js_lib ? rs.js_lib.split(',').map(function(d){
					return {
						main: ''
						, src: '../../lib/'+ d
					};
				}) : '';
				code.scriptCode = rs.js ? {
					scriptCode: rs.js
				} : '';

				return code;
			}).then(function(code){
				return tpl( code );
			});
		}
	}
	;

module.exports = ReaderAdminView;