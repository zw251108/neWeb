'use strict';

var config    = require('../../config.js')
	, db        = require('../db.js')

	, tpl       = require('../emmet/tpl.js')

	, CodeModel = require('../editor/model.js')

	, Model         = require('./model.js')

	, View = {
		province: function(){
			return CodeModel.getEditorByName('admin/basedata/province').then(function(rs){
				return rs[0];
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
		, city: function( province ){
			var rs;

			if( province ){
				rs = Model.city( province )
				//	.then(function(rs){
				//
				//});
			}
			else{
				rs = Promise.reject([]);
			}

			return rs;
		}
		, district: function( city ){}
		, town: function( town ){}
		, village: function( village ){}

		, university: function( university ){}
	}
	;

module.exports = View;