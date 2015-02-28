/**
 * @module  code
 * */
define(function(require){
	//require('css!')
	var cm = require('../plugin/codeMirror/lib/codemirror');
	require('../plugin/codeMirror/lib/codemirror');
	require('../plugin/codeMirror/mode/xml/xml');
	require('../plugin/codeMirror/mode/htmlmixed/htmlmixed');
	require('../plugin/codeMirror/mode/javascript/javascript');
	require('../plugin/codeMirror/mode/css/css');
	require('../plugin/codeMirror/addon/comment/comment');
	require('../plugin/codeMirror/addon/comment/continuecomment');
	require('../plugin/codeMirror/addon/fold/foldcode');
	require('../plugin/codeMirror/addon/fold/foldgutter');
	require('../plugin/codeMirror/addon/fold/brace-fold');
	require('../plugin/codeMirror/addon/fold/xml-fold');
	require('../plugin/codeMirror/emmet/emmet.min');

	return function(target, type, readOnly){
		var options = {
			lineNumbers : true
			, foldGutter: true
			, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
			, matchBrackets: true
			, readOnly: true
		};

		switch(type){
			case 'html':
				options.mode = 'text/html';
				options.profile = 'xhtml';
				break;
			case 'css':
				options.mode = 'text/css';
				break;
			case 'js':
				options.mode = 'javascript';
				options.extraKeys = {
					Enter:'newlineAndIndentContinueComment'
					, 'Ctrl-/': 'toggleComment'
				};
				break;
		}

		options.readOnly = !!readOnly;

		return cm.fromTextArea(target, options);
	}
});