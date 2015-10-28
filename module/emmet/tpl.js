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
				return d.moduleMain ? moduleMain(d.moduleMain).join('') : '';
			}
			, modulePopup: function(d){
				return d.modulePopup ? modulePopup(d.modulePopup).join('') : '';
			}
		}
	})
	, moduleMain    = emmetTpl({
		template: getEmmet('module-main.html')
		, filter: {
			toolbar: function(d){
				return  d.toolbar ? d.toolbar.map(function(t){
					var html = '';
					if( t.type === 'button' ){
						html = toolbarBtn(t).join('');
					}
					else{
						html = toolbarLink(t).join('');
					}

					return html;
				}).join('') : '';
			}
		}
	})
	, modulePopup   = emmetTpl({
		template: getEmmet('module-popup.html')
		, filter: {
			toolbar: function(d){
				var temp = d.toolbar ? d.toolbar.map(function(t){
					var html = '';
					if( t.type === 'button' ){
						html = toolbarBtn(t).join('');
					}
					else{
						html = toolbarLink(t).join('');
					}

					return html;
				}).join('') : '';

				return temp + toolbarBtn({
					id: d.id ? (d.id + 'Close') : ''
					, icon: 'cancel module_close'
					, title: '关闭'
				}).join('');
			}
		}
	})

	, toolbarBtn    = emmetTpl({
		template: getEmmet('toolbar.html')
	})
	, toolbarLink   = emmetTpl({
		template: getEmmet('toolbar-link.html')
	})

	, footer        = emmetTpl({
		template: getEmmet('footer.html')
		, filter: {
			nav: function(d){
				return d.nav.map(function(d){
					return '<li><a href="'+ d.href +'" class="icon icon-'+ d.icon + (d.on ? ' on' : '') +'"></a>';
				}).join('');
			}
		}
	})

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
		, footer: ''
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
			, footer: function(d){console.log(d.footer)
				return d.footer ? footer(d.footer) : '';
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
	, page  = function(page){
		page = extend( page );

		return pageTpl(page).join('');
	}
	;
//console.log(getEmmet('footer.html'))
module.exports = page;