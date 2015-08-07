'use strict';

var fs = require('fs')
	, Cheerio = require('cheerio')

	, config        = require('../../config.js')
	, db            = require('../db.js')
	, admin         = require('../admin.js')
	, tpl           = require('../emmet/tpl.js')

	, code          = require('../editor/model.js')

	, model         = require('./model.js')

	, View = {
		tag: function(){
			return code.codeByName('admin/tag').then(function(rs){
				var code = {};

				code.title = rs.name;

				code.stylesheet = rs.css_lib ? rs.css_lib.split(',').map(function(d){
					return {
						path: '../lib/'+ d
					};
				}) : [];

				code.script = rs.js_lib ? rs.js_lib.split(',').map(function(d){
					return {
						main: ''
						, src: '../lib/'+ d
					};
				}) : [];

				code.scriptCode = rs.js ? {
					scriptCode: rs.js
				} : {};
				code.style = rs.css ? {
					style: rs.css
				} : {};
				code.main = rs.html;

				return code;
			}).then(function(code){
				return tpl( code );
			});
		}
	}
	;

module.exports = View;