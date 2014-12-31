/**
 *
 * */
require.config({
	baseUrl: '../script/'
	, paths: {
		jquery: 'lib/jquery.min'
		, global: 'module/global'
		, socket: 'module/socket'
		, template: 'ui/jquery.template'
	}
});
require(['jquery', 'module/document/document'], function($, $document){
	$('<link/>', {
		rel: 'stylesheet'
		, href: '../script/plugin/codeMirror/lib/codemirror.css'
	}).prependTo('head');
});