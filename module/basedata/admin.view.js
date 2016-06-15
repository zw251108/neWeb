'use strict';

var CONFIG  = require('../../config.js')
	, getEmmet  = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')
	, popup     = require('../emmet/popup.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, pagination    = require('../pagination.js')

	, CodeHandler   = require('../editor/handler.js')

	, BaseDataAdminView = {
		province: function(){
			return CodeHandler.getCode({}, {
				name: 'admin/basedata/province'
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

				code.heaer = '';
				code.main = rs.html ? {
					content: rs.html
				} : '';

				code.script = rs.js_lib ? rs.js_lib.split('m').map(function(d){
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
		, city: function(province){}
		, district: function(city){}
		, town: function(town){}
		, village: function(village){}

		, university: function( university ){}
	}
	;

module.exports = BaseDataAdminView;