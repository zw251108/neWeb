'use strict';

var CONFIG  = require('../config.js')
	, tools = require('./tools.js')

	// , fs    = require('fs')
	// , path  = require('path')
	//
	// , HTML_DEFAULT_TPL = 'template/page.html'
	//
	// , htmlTpl = fs.readFileSync(__dirname +'/../'+ HTML_DEFAULT_TPL).toString()
	//
	// , getTpl = function(){
	//
	// }
	//
	// , htmlEngine = function(data){
	// 	return Object.keys(data).reduce(function(tpl, d){
	// 		return tpl.replace(d, data[d]);
	// 	}, htmlTpl);
	// }
	//
	// , getEmmet      = require('./emmet/getEmmet.js')
	// , emmetTpl      = require('./emmetTpl/emmetTpl.js').template
	//
	// , TPL_CACHE = {}
	// , TPL_DIR = 'template/'
	// , TPL_KEY = '%'
	//
	// , stylesheet    = emmetTpl({
	// 	template: getEmmet('stylesheet.html')
	// })
	// , style         = emmetTpl({
	// 	template: getEmmet('style.html')
	// })
	//
	// , header        = emmetTpl({
	// 	template: getEmmet('header.html')
	// 	, filter: {
	// 	}
	// })
	//
	// , main          = emmetTpl({
	// 	template: getEmmet('main.html')
	// 	, filter: {
	// 		moduleMain: function(d){
	// 			return d.moduleMain ? moduleMain(d.moduleMain).join('') : '';
	// 		}
	// 		, modulePopup: function(d){
	// 			return d.modulePopup ? modulePopup(d.modulePopup).join('') : '';
	// 		}
	// 	}
	// })
	// , moduleMain    = emmetTpl({
	// 	template: getEmmet('module-main.html')
	// 	, filter: {
	// 		icon: function(d){
	// 			return d.icon || d.id;
	// 		}
	// 		, toolbar: function(d){
	// 			return  d.toolbar ? d.toolbar.map(function(t){
	// 				var html = '';
	// 				if( t.type === 'button' ){
	// 					html = toolbarBtn(t).join('');
	// 				}
	// 				else{
	// 					html = toolbarLink(t).join('');
	// 				}
	//
	// 				return html;
	// 			}).join('') : '';
	// 		}
	// 	}
	// })
	// , modulePopup   = emmetTpl({
	// 	template: getEmmet('module-popup.html')
	// 	, filter: {
	// 		toolbar: function(d){
	// 			var temp = d.toolbar ? d.toolbar.map(function(t){
	// 				var html = '';
	// 				if( t.type === 'button' ){
	// 					html = toolbarBtn(t).join('');
	// 				}
	// 				else{
	// 					html = toolbarLink(t).join('');
	// 				}
	//
	// 				return html;
	// 			}).join('') : '';
	//
	// 			return temp + toolbarBtn({
	// 					id: d.id ? (d.id + 'Close') : ''
	// 					, icon: 'cancel module_close'
	// 					, title: '关闭'
	// 				}).join('');
	// 		}
	// 	}
	// })
	//
	// , toolbarBtn    = emmetTpl({
	// 	template: getEmmet('toolbar.html')
	// })
	// , toolbarLink   = emmetTpl({
	// 	template: getEmmet('toolbar-link.html')
	// })
	//
	// , footer        = emmetTpl({
	// 	template: getEmmet('footer.html')
	// 	, filter: {
	// 		nav: function(d){
	// 			return d.nav.map(function(d){
	// 				return '<li><a href="../'+ d.href +'" class="icon icon-'+ d.icon + (d.on ? ' on' : '') +'"></a>';
	// 			}).join('');
	// 		}
	// 	}
	// })
	//
	// , script        = emmetTpl({
	// 	template: getEmmet('script.html')
	// })
	// , scriptCode    = emmetTpl({
	// 	template: getEmmet('scriptCode.html')
	// })
	//
	// , defaults  = {
	// 	title: ''
	// 	, stylesheet: [{
	// 		path: '../style/style.css'}, {
	// 		path: '../style/test.css'
	// 	}]
	// 	, style: ''
	// 	, header: {}
	// 	, main: ''
	// 	, footer: ''
	// 	, script: ''
	// 	, scriptCode: ''
	// }
	//
	// , pageTpl  = emmetTpl({
	// 	template: getEmmet('page.html')
	// 	, filter: {
	// 		stylesheet: function(d){
	// 			return d.stylesheet ? stylesheet(d.stylesheet).join('') : '';
	// 		}
	// 		, style: function(d){
	// 			return d.style ? style(d.style) : '';
	// 		}
	// 		, header: function(d){
	// 			return d.header ? header(d.header) : '';
	// 		}
	// 		, main: function(d){
	// 			//return d.main ? (typeof d.main === 'object' ? main(d.main) : d.main) : '';
	// 			var result = '';
	// 			if( !d.main ){
	// 				result += d.moduleMain ? moduleMain( d.moduleMain ) : '';
	// 				result += d.modulePopup ? moduleMain( d.modulePopup ) : '';
	// 			}
	//
	// 			return result;
	// 		}
	// 		, footer: function(d){
	// 			return d.footer ? footer(d.footer) : '';
	// 		}
	// 		, script: function(d){
	// 			return d.script ? script(d.script).join('') : '';
	// 		}
	// 		, scriptCode: function(d){
	// 			return d.scriptCode ? scriptCode(d.scriptCode) : '';
	// 		}
	// 	}
	// })
	// , extend = function(options){
	// 	var k;
	//
	// 	for( k in defaults ) if( defaults.hasOwnProperty(k) ){
	// 		options[k] = k in options ? options[k] : defaults[k];
	// 	}
	//
	// 	return options;
	// }
	// , page  = function(page){
	// 	page = extend( page );
	//
	// 	return pageTpl(page).join('');
	// }
	//
	// , View = {
	// 	page: function(page){
	// 		return tpl({
	// 			title: ''
	// 		})
	// 	}
	// 	, render: function(data){
	//
	// 	}
	// 	, html: function(){}
	// 	, metroTpl: emmetTpl({
	// 		template: 'a[href=%href%]' +
	// 			'>section#%id%.metro.metro-%id%.%metroSize%[title=%hrefTitle%]' +
	// 			'>h2.metro_title.icon.icon-%icon%{%title%}' +
	// 			'+div.m_info{%info%}' +
	// 			'+span.metro_info'
	// 		, filter: {
	// 			icon: function(d){
	// 				return d.icon || d.id;
	// 			}
	// 			, href: function(d){
	// 				return d.href || d.id + '/';
	// 			}
	// 			, hrefTitle: function(d){
	// 				return d.hrefTitle || d.title;
	// 			}
	// 		}
	// 	})
	// }

	/**
	 * @param   options Object
	 * @param   options.template    String
	 * @param   options.filter      Object
	 * @param   options.tplKeyStart String
	 * @param   options.tplKeyEnd   String
	 * */
	, Tpl = function(options){
		this.template = options.template;
		this.filter = options.filter;
		this.tplKeyStart = options.tplKeyStart || '%';
		this.tplKeyEnd = options.tplKeyEnd || '%';
		this.keyList = this.template.match( new RegExp(this.tplKeyStart +'(\\w*?)'+ this.tplKeyEnd, 'g') );
	}
	;

tools.extend(Tpl.prototype, {
	render: function(data){
		var i = 0, j
			, m, n
			, temp, html
			, template = this.template
			, tplKeyStart = this.tplKeyStart
			, tplKeyEnd = this.tplKeyEnd
			, keyList = this.keyList
			, filter = this.filter
			, key
			, keyWord
			, keyExpr = new RegExp(tplKeyStart +'(.*)'+ tplKeyEnd)
			, replace
			, result = []
			;

		if( !Array.isArray( data ) ){
			data = [data];
		}

		for(j = data.length; i < j; i++){

			temp = data[i];
			html = template;

			for( m = 0, n = keyList.length; m < n; m++ ){

				keyWord = keyList[i];

				// 获取键值
				key = keyExpr.exec( keyWord )[1];

				if( key in filter ){
					if( filter[key] instanceof Tpl ){   // 判断过滤函数是否为另一个模板
						replace = filter[key].render( temp[key] || [] );
					}
					else{
						replace = filter[key](temp, i);
					}
				}
				else if( key in temp ){
					replace = temp[key];
				}
				else{
					replace = '';
				}

				html = html.replace(new RegExp(keyWord, 'g'), replace);
			}

			result.push( html );
		}

		return result.join('');
	}
});

// module.exports = View;
module.exports = Tpl;