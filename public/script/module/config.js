/**
 * @module config
 * */
define({
	requireConfig: {
		paths: {
			jquery: 'lib/jquery.min'
			, text: '../lib/requirejs-text/text'
			, css: 'lib/css'
			, d3: 'lib/d3.min'

			, global: 'module/global'
			//, popup: 'module/popup'
			, socket: 'module/socket'
			, tag: 'module/tag'
			, time: 'module/time'

			, codeEditor: 'module/codeEditor'

			, template: 'ui/jquery.emmetTpl'

			, blog: 'module/blog/blog'
			, document: 'module/document/document'
			, editor: 'module/editor/editor'
			, talk: 'module/talk/talk'
		}
		, baseUrl: '../script/'
	}
	, dataSource: {
		json: 'text!../data/example'
	}
});