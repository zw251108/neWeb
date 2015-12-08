'use strict';

var config  = require('../../config.js')
	, db    = require('../db.js')

	, tpl   = require('../emmet/tpl.js')

	, CodeModel  = require('../editor/model.js')

	, View = {
		tag: function(){
			return CodeModel.getEditorByName('admin/tag').then(function(rs){console.log(rs)
				return rs[0];
			}).then(function(rs){console.log(rs)
				var code = {};

				code.title = rs.name;

				code.stylesheet = rs.css_lib ? rs.css_lib.split(',').map(function(d){
					return {
						path: '../lib/'+ d
					};
				}) : '';
				code.style = rs.css ? {
					style: rs.css
				} : '';

				code.header = '';
				code.main = rs.html ? {
					content: rs.html
				} : '';

				code.script = rs.js_lib ? rs.js_lib.split(',').map(function(d){
					return {
						main: ''
						, src: '../lib/'+ d
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

module.exports = View;