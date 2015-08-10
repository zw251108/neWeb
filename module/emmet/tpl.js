'use strict';

var admin         = require('../admin.js')

	, getEmmet      = require('./getEmmet.js')
	, emmetTpl      = require('../emmetTpl/emmetTpl.js').template

	, stylesheet    = emmetTpl({
		template: getEmmet('stylesheet.html')
	})
	, style         = emmetTpl({
		template: getEmmet('style.html')
	})

	, header        = emmetTpl({
		template: getEmmet('header.html')
	})

	, main          = emmetTpl({
		template: getEmmet('main.html')
		, filter: {
			moduleMain: function(d){
				return d.moduleMain ? moduleMain(d.moduleMain) : '';
			}
			, modulePopup: function(d){
				return d.modulePopup ? modulePopup(d.modulePopup) : '';
			}
		}
	})
	, moduleMain    = emmetTpl({
		template: getEmmet('module-main.html')
	})
	, modulePopup   = emmetTpl({
		template: getEmmet('module-popup.html')
	})

	, footer    // todo

	, script        = emmetTpl({
		template: getEmmet('script.html')
	})
	, scriptCode    = emmetTpl({
		template: getEmmet('scriptCode.html')
	})

	, defaults  = {
		title: ''
		, stylesheet: [{
			path: '../style/style.css'}, {
			path: '../style/test.css'
		}]
		, style: ''
		, header: {}
		, main: ''
		, script: ''
		, scriptCode: ''
	}

	, pageTpl  = emmetTpl({
		template: getEmmet('page.html')
		, filter: {
			stylesheet: function(d){
				return d.stylesheet ? stylesheet(d.stylesheet).join('') : '';
			}
			, style: function(d){
				return d.style ? style(d.style) : '';
			}
			, header: function(d){
				return d.header ? header(d.header) : '';
			}
			, main: function(d){
				return d.main ? (typeof d.main === 'object' ? main(d.main) : d.main) : '';
			}
			, script: function(d){
				return d.script ? script(d.script).join('') : '';
			}
			, scriptCode: function(d){
				return d.scriptCode ? scriptCode(d.scriptCode) : '';
			}
		}
	})
	, extend = function(options){
		var k;

		for( k in defaults ) if( defaults.hasOwnProperty(k) ){
			options[k] = k in options ? options[k] : defaults[k];
		}

		return options;
	}
	, page  = function(page){console.log(page.title)
		page = extend( page );

		return pageTpl(page).join('');
	}
	;

module.exports = page;