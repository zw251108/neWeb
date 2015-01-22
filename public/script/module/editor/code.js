/**
 * @module code
 * */
require.config({
	baseUrl: '../script/'
	, paths: {
		jquery: 'lib/jquery.min'
		, global: 'module/global'
		, socket: 'module/socket'
		, template: 'ui/jquery.emmetTpl'
	}
});
require(['jquery', 'global', 'socket'
	, 'plugin/codeMirror/lib/codemirror'
	, 'plugin/codeMirror/emmet/emmet.min'
	, 'plugin/codeMirror/mode/xml/xml'
	, 'plugin/codeMirror/mode/htmlmixed/htmlmixed'
	, 'plugin/codeMirror/mode/javascript/javascript'
	, 'plugin/codeMirror/mode/css/css'
	, 'plugin/codeMirror/addon/comment/comment'
	, 'plugin/codeMirror/addon/comment/continuecomment'
	, 'plugin/codeMirror/addon/fold/foldcode'
	, 'plugin/codeMirror/addon/fold/foldgutter'
	, 'plugin/codeMirror/addon/fold/brace-fold'
	, 'plugin/codeMirror/addon/fold/xml-fold'
	, 'template'
], function($, g, socket, cm){
	$('#editor').find('textarea').each(function(){
		var mode = this.className;

		if( mode.indexOf('code-html') > -1 ){
			mode = 'text/html';
		}
		else if( mode.indexOf('code-css') > -1 ){
			mode = 'text/css';
		}
		else if( mode.indexOf('code-js') > -1 ){
			mode = 'javascript';
		}
		cm.fromTextArea(this, {
			mode: mode
			, lineNumbers : true
			//, foldGutter: true
			, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
			, matchBrackets: true
			//, readOnly: true
		});
	});
});