'use strict';
console.log(12313)
/**
 * 模板管理
 * */
var fs = require('fs')
	, path = require('path')
	, emmetTpl = require('./emmetTpl/emmetTpl.js').template
	, TPL_CACHE = {}
	, TPL_DIR = 'tpl/'
	, TPL_KEY = '%'
	, readTpl = function(filePath){
		var rs = '';
		if( filePath in TPL_CACHE ){
			rs = TPL_CACHE[filePath];
		}
		else{
			try{
				rs = fs.readFileSync( TPL_DIR + filePath +'.html').toString();
				TPL_CACHE[filePath] = rs;
				console.log('read file ', TPL_DIR + filePath +'.html' );
			}
			catch(e){
				console.log(e);
			}
		}

		return rs;
	}
	, handlerData = function(filePath){
		var data
			, type
			, i, j
			, m, n
			, k
			, t, temp, tpl
			, rs = ''
			;

		for(i = 0, j = filePath.length; i < j; i++){
			t = filePath[i];
			type = typeof t;

			if( type === 'string' ){
				rs += readTpl( t );
			}
			else if( type === 'object' ){

				tpl = readTpl( filePath.tpl );
				temp = tpl;

				if( 'data' in t ){
					data = filePath.data;

					if( typeof data === 'object' && !Array.isArray( data ) ){
						data = [data];
					}

					for( m = 0, n = data.length; m < n; m++ ){
						t = data[m];

						for( k in t ) if( t.hasOwnProperty( k ) ){
							temp = temp.replace(TPL_KEY + k + TPL_KEY, t[k]);
						}

						rs += temp;
						temp = tpl;
					}

					for( k in filePath ) if( filePath.hasOwnProperty(k) && k !== 'tpl' && k !== 'data' ){

					}
					//else{
					//	t = data;
					//	for( k in t ) if( t.hasOwnProperty( k ) ){
					//		temp = temp.replace('%'+ k +'%', t[k]);
					//	}
					//	rs += temp;
					//}
				}
			}
		}

		return rs;
	}
	;

module.exports = {
	tpl:        function(filePath){
		return readTpl( filePath );
	}
	, mainTpl:  emmetTpl({
		template: 'section#%id%.module.module-main.module-%id%.%size%' +
			'>h2.module_title.icon.icon-%id%{%title%}' +
			'+ul.toolbar{%toolbar%}' +
			'+div.module_content{%content%}'
	})
	, metroTpl: emmetTpl({
		template: 'a[href=%id%/]>section#%id%.module.module-metro.module-%id%.%size%' +
			'>h2.module_title.icon.icon-%id%{%title%}' +
			'+ul.toolbar>li>button.icon.icon-cancel.module_close' +
			'^^div.m_info{%info%}' +
			'+div.module_content'
	})
	, popupTpl: emmetTpl({
		template: 'dialog#%id%.module.module-popup.%size%.hidden[open=open]' +
			'>ul.toolbar>li>button.icon.icon-cancel.module_close' +
			'^^div.module_content{%content%}' +
			'+div.btnGroup{%button%}'
	})
	, toolbarTpl:   emmetTpl({
		template: 'li>button#%id%.icon.icon-%icon%[title=%title%]{%text%}'
		, filter: {
			icon: function(d){
				return d.icon || 'settle';
			}
		}
	})
	, stylesheetTpl:    emmetTpl({
		template: 'link[rel=stylesheet href=%path%]'
	})
	, styleTpl: emmetTpl({
		template: 'style{%style%}'
	})
	, scriptTpl:    emmetTpl({
		template: 'script[data-main=%main% src=%src%]'
	})
	, scriptCodeTpl:    emmetTpl({
		template: 'script{%script%}'
	})
	, html: function(filePath, options){
		var rs = ''
			, script = ''
			, style = ''
			;

		rs += readTpl( filePath );

		rs = rs.replace('%title%', options.title || '');

		options.stylesheet  && ( style += this.stylesheetTpl(options.stylesheet).join('') );
		options.style       && ( style += this.styleTpl(options.style).join('') );
		rs = rs.replace('%style%', style);

		rs = rs.replace('%module%', options.modules || '');

		options.script      && ( script += this.scriptTpl(options.script).join('') );
		options.scriptCode  && ( script += this.scriptCodeTpl(options.scriptCode).join('') );
		rs = rs.replace('%script%', script);

		return rs;
	}
};