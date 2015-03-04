/**
 *
 * */
require.config({
	paths: {
		jquery: 'lib/jquery.min'
		, css: 'lib/css'

		, global: 'module/global'
		, socket: 'module/socket'
		, codeEditor: 'module/codeEditor'
		, template: 'ui/jquery.emmetTpl'

		, document: 'module/document/document'
	}
	, 	baseUrl: '../script/'
});
require(['document'], function(document){});