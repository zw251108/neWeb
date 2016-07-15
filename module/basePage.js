'use strict';

var CONFIG = require('../config.js')

	, fs = require('fs')

	, Tpl = require('./tpl.js')

	, TPL_CACHE = {}
	, getTpl = function(path){
		var temp = __dirname +'../tpl/'+ path
			, html
			;
		if( temp in TPL_CACHE ){
			console.log('从缓存中读取模板 '+ path);
			html = TPL_CACHE[temp];
		}
		else{
			console.log('从文件中读取模板 '+ path);
			html = fs.readFileSync( temp ).toString();
			TPL_CACHE[temp] = html;
		}

		return html;
	}

	, stylesheet    = new Tpl({
		template: '<link rel="stylesheet" href="%path%"/>'
	})
	, style     = new Tpl({
		template: '<style>%style%</style>'
	})
	, header    = new Tpl({
		template: getTpl('header.html')
	})
	, main      = new Tpl({
		template: getTpl('main.html')
	})

	, toolbarBtn    = new Tpl({
		template: '<button id="%id%" type="button" class="icon icon-%icon%" title="%title%">%text%</button>'
	})
	, toolbarLink   = new Tpl({
		template: '<a href="%href%" id="%id%" class="icon icon-%icon%" title="%title%">%text%</a>'
	})
	, toolbar   = new Tpl({
		template: '<li></li>'
		, filter: {

		}
	})

	, nav       = new Tpl({
		template: '<li><a href="../%href%" class="icon icon-%icon% %on%"></a>'
		, filter: {
			on: function(d){
				return d.on ? 'on' : '';
			}
		}
	})

	, moduleMain    = new Tpl({
		template: getTpl('module-main.html')
		, filter: {
			icon: function(d){
				return d.icon || d.id;
			}
			, toolbar: toolbar
		}
	})
	, modulePopup   = new Tpl({
		template: getTpl('module-popup.html')
		, filter: {
			toolbar: toolbar
		}
	})

	, footer    = new Tpl({
		template: getTpl('footer.html')
		, filter: {
			nav: nav
		}
	})

	, script    = new Tpl({
		template: '<script data-main="%main%" src="%src%"></script>'
	})
	, scriptCode    = new Tpl({
		template: '<script>%scriptCode%</script>'
	})

	, page = new Tpl({
		template: getTpl('page.html')
		, filter: {
			stylesheet: stylesheet
			, style: style
			, header: header
			, main: main
			, footer: footer
			, script: script
			, scriptCode: scriptCode
		}
	})
	;

module.exports = {

};