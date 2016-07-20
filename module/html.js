'use strict';

var CONFIG = require('../config.js')

	, fs = require('fs')

	, tools = require('./tools.js')

	, Tpl   = require('./tpl.js')

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

	/**
	 * 外部样式
	 * */
	, stylesheet    = new Tpl({
		template: '<link rel="stylesheet" href="%path%"/>'
	})
	, style         = new Tpl({
		template: '<style>%style%</style>'
	})

	/**
	 * 外部脚本
	 * */
	, script        = new Tpl({
		template: '<script data-main="%main%" src="%src%"></script>'
	})
	, scriptCode    = new Tpl({
		template: '<script>%scriptCode%</script>'
	})

	/**
	 * 页头
	 * */
	, header        = new Tpl({
		template: getTpl('header.html')
	})

	/**
	 * 页脚
	 * */
	, footer        = new Tpl({
		template: getTpl('footer.html')
		, filter: {
			nav: nav
		}
	})

	/**
	 * 页面内容
	 * */
	// 工具条
	, toolbarBtn    = new Tpl({
		template: '<button id="%id%" type="button" class="icon icon-%icon%" title="%title%">%text%</button>'
	})
	, toolbarLink   = new Tpl({
		template: '<a href="%href%" id="%id%" class="icon icon-%icon%" title="%title%">%text%</a>'
	})
	, toolbar       = new Tpl({
		template: '<li></li>'
		, filter: {
			btn: toolbarBtn
			, link: toolbarLink
		}
	})

	// 主体模块
	, moduleMain    = new Tpl({
		template: getTpl('module-main.html')
		, filter: {
			icon: function(d){
				return d.icon || d.id;
			}
			, toolbar: toolbar
		}
	})
	// 弹窗模块
	, modulePopup   = new Tpl({
		template: getTpl('module-popup.html')
		, filter: {
			toolbar: toolbar
		}
	})
	, main          = new Tpl({
		template: getTpl('main.html')
		, filter: {
			moduleMain: moduleMain
			, modulePopup: modulePopup
		}
	})

	// 导航
	, nav           = new Tpl({
		template: '<li><a href="../%href%" class="icon icon-%icon% %on%"></a>'
		, filter: {
			on: function(d){
				return d.on ? 'on' : '';
			}
		}
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
	, defaults = {
		stylesheet: [{
			path: '/style/style.css'
		}, {
			path: '/style/test.css'
		}]
	    , style: {}
	    , header: {}
		, main: {
			moduleMain: {}
			, modulePopup: []
		}
		, footer: {}
		, script: [{

		}]
		, scriptCode: {}
	}
	;

module.exports = {
	getTpl: getTpl
	, renderPage: function(pageData){
		return CONFIG.docType.html5 + page.render( tools.extend(tools.extend({}, defaults), pageData) );
	}
};