'use strict';

var error       = require('./error/error.js')
	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js')

	, pageFirst
	, pageLast
	, pageCurrent
	, pagePrev
	, pageNext

	, pagination = emmetTpl({
		template: ''
		, filter: {

		}
	})

	/**
	 * @namespace   Pagination
	 * */
	, Pagination = {
		/**
		 * @namespace   Model
		 * @memberof    Pagination
		 * @desc    业务相关 sql 语句集合
		 * */
		Model: {

		}

		/**
		 * @namespace   Handler
		 * @memberof    Pagination
		 * @desc    数据处理方法集合
		 * */
		, Handler: {}

		/**
		 * @namespace   View
		 * @memberof    Pagination
		 * @desc    视图模板集合
		 * */
		, View: {

		}
	}
	;

