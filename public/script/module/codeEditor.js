/**
 * @module  code
 * */
define(['plugin/codeMirror/lib/codemirror'
	, 'css!plugin/codeMirror/lib/codemirror.css'
	, 'css!plugin/codeMirror/addon/fold/foldgutter.css'
	, 'plugin/codeMirror/mode/xml/xml'
	, 'plugin/codeMirror/mode/htmlmixed/htmlmixed'
	, 'plugin/codeMirror/mode/javascript/javascript'
	, 'plugin/codeMirror/mode/css/css'
	, 'plugin/codeMirror/addon/comment/comment'
	, 'plugin/codeMirror/addon/comment/continuecomment'
	, 'plugin/codeMirror/addon/fold/foldcode'
	, 'plugin/codeMirror/addon/fold/brace-fold'
	, 'plugin/codeMirror/addon/fold/xml-fold'
	, 'plugin/codeMirror/emmet/emmet.min'
], function(cm){
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
				readOnly && (options.profile = 'xhtml');
				break;
			case 'css':
				options.mode = 'text/css';
				break;
			case 'js':
				options.mode = 'javascript';
				readOnly && (options.extraKeys = {
					Enter:'newlineAndIndentContinueComment'
					, 'Ctrl-/': 'toggleComment'
				});
				break;
		}

		readOnly && (options.readOnly = !!readOnly);

		return cm.fromTextArea(target, options);
	}
});