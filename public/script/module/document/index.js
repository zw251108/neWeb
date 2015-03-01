/**
 *
 * */
require.config({
	baseUrl: '../script/',
	paths: {
		jquery: 'lib/jquery.min'
		, css: 'lib/css'

		, global: 'module/global'
		, socket: 'module/socket'
		, codeEditor: 'module/codeEditor'
		, template: 'ui/jquery.emmetTpl'

		, document: 'module/document/document'
	}
});
require(['document'], function(document){});