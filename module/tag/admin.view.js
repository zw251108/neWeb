'use strict';

var fs = require('fs')
	, Cheerio = require('cheerio')

	, config        = require('../../config.js')
	, db            = require('../db.js')

	, admin         = require('../admin.js')
	, htmlToEmmet   = require('../emmet/htmlToEmmet')
	, emmetTpl      = require('../emmetTpl/emmetTpl').template

	, model = require('./model.js')

	, code  = require('../editor/model.js')

	, getEmmet = function( dir ){
		return htmlToEmmet(Cheerio.load, fs.readFileSync(__dirname +'/../../tpl/'+ dir).toString());
	}
	, page          = getEmmet('page.html')
	, stylesheet    = emmetTpl({
		template: getEmmet('stylesheet.html')
	})
	, style         = emmetTpl({
		template: getEmmet('style.html')
	})
	, script        = emmetTpl({
		template: getEmmet('script.html')
	})
	, scriptCode    = emmetTpl({
		template: getEmmet('scriptCode.html')
	})

	, html = emmetTpl({
		template: page
		, filter: {
			stylesheet: function(d){
				return stylesheet(d.stylesheet).join('');
			}
			, style: function(d){
				return style(d.style);
			}
			, script: function(d){
				return script(d.script).join('');
			}
			, scriptCode: function(d){
				return scriptCode(d.scriptCode);
			}
		}
	})
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
				return html( code );
			});
		}
	}
	;

module.exports = View;