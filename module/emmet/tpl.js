'use strict';

var fs = require('fs')
	, Cheerio = require('cheerio')

	, config        = require('../../config.js')
	, db            = require('../db.js')

	, admin         = require('../admin.js')
	, htmlToEmmet   = require('./htmlToEmmet.js')
	, emmetTpl      = require('../emmetTpl/emmetTpl.js').template

	, getEmmet  = function( dir ){
		console.log('read file: tpl/', dir);
		return htmlToEmmet( Cheerio.load, fs.readFileSync(__dirname +'/../../tpl/'+ dir).toString() );
	}
	, stylesheet    = emmetTpl({
		template: getEmmet('stylesheet.html')
	})
	, style         = emmetTpl({
		template: getEmmet('style.html')
	})

	, header        = emmetTpl({
		template: getEmmet('header.html')
	})

	, main      // todo
	, footer    // todo

	, script        = emmetTpl({
		template: getEmmet('script.html')
	})
	, scriptCode    = emmetTpl({
		template: getEmmet('scriptCode.html')
	})

	, page  = emmetTpl({
		template: getEmmet('page.html')
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
	;

module.exports = page;