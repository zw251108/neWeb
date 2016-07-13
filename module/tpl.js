'use strict';

var CONFIG  = require('../config.js')

	, fs    = require('fs')
	, path  = require('path')

	, tools = require('./tools.js')

	, HTML_DEFAULT_TPL = 'tpl/page.html'

	, htmlTpl = fs.readFileSync(__dirname +'/../'+ HTML_DEFAULT_TPL).toString()

	, getTpl = function(){

	}

	, htmlEngine = function(data){
		return Object.keys(data).reduce(function(tpl, d){
			return tpl.replace(d, data[d]);
		}, htmlTpl);
	}

	, getEmmet      = require('./emmet/getEmmet.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, TPL_CACHE = {}
	, TPL_DIR = 'tpl/'
	, TPL_KEY = '%'

	, stylesheet    = emmetTpl({
		template: getEmmet('stylesheet.html')
	})
	, style         = emmetTpl({
		template: getEmmet('style.html')
	})

	, header        = emmetTpl({
		template: getEmmet('header.html')
		, filter: {
		}
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
			icon: function(d){
				return d.icon || d.id;
			}
			, toolbar: function(d){
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
					return '<li><a href="../'+ d.href +'" class="icon icon-'+ d.icon + (d.on ? ' on' : '') +'"></a>';
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
				//return d.main ? (typeof d.main === 'object' ? main(d.main) : d.main) : '';
				var result = '';
				if( !d.main ){
					result += d.moduleMain ? moduleMain( d.moduleMain ) : '';
					result += d.modulePopup ? moduleMain( d.modulePopup ) : '';
				}

				return result;
			}
			, footer: function(d){
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

	, View = {
		page: function(page){
			return tpl({
				title: ''
			})
		}
		, render: function(data){

		}
		, html: function(){}
		, metroTpl: emmetTpl({
			template: 'a[href=%href%]' +
				'>section#%id%.metro.metro-%id%.%metroSize%[title=%hrefTitle%]' +
				'>h2.metro_title.icon.icon-%icon%{%title%}' +
				'+div.m_info{%info%}' +
				'+span.metro_info'
			, filter: {
				icon: function(d){
					return d.icon || d.id;
				}
				, href: function(d){
					return d.href || d.id + '/';
				}
				, hrefTitle: function(d){
					return d.hrefTitle || d.title;
				}
			}
		})
	}

	/**
	 * @param   options Object
	 * @param   options.template    String
	 * @param   options.filter      Object
	 * */
	, Tpl = function(options){
		this.template = options.template;
		this.filter = options.filter;
		this.key = options.tplKey || '%';
		this.keyList = this.template
	}
	;

tools.extend(Tpl.prototype, {

	render: function(data){
		var i = 0, j, temp, html
			, replace
			, key
			, tplKey = this.tplKey
			, keyList = this.keyList
			, filter = this.filter
			, result = []
			;

		if( !Array.isArray( data ) ){
			data = [data];
		}

		for(j = data.length; i < j; i++){

			temp = data[i];
			html = this.template;

			for( key in keyList ) if( keyList.hasOwnProperty(key) ){

				if( key in filter ){
					if( filter[key] instanceof Tpl ){
						replace = filter[key].render( temp[key] || []);
					}
					else{
						replace = filter[key](temp, i);
					}
				}
				else if( key in t ){
					replace = temp[key];
				}
				else{
					replace = '';
				}

				html = html.replace(new RegExp(tplKey + key + tplKey, 'g'), replace);
			}

			result.push( h );
		}

		return result.join('');
	}
});

module.exports = View;