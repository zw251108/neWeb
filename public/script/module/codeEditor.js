/**
 * @module  codeEditor
 * @require plugin/codeMirror/lib/codemirror
 * @require plugin/codeMirror/lib/codemirror
 * @require plugin/codeMirror/lib/codemirror
 * @require plugin/codeMirror/lib/codemirror
 * */
define(['plugin/codeMirror/lib/codemirror'
	, 'css!plugin/codeMirror/lib/codemirror.css'

	, 'plugin/codeMirror/mode/xml/xml'
	, 'plugin/codeMirror/mode/htmlmixed/htmlmixed'
	, 'plugin/codeMirror/mode/javascript/javascript'
	, 'plugin/codeMirror/mode/css/css'

	, 'plugin/codeMirror/addon/comment/comment'
	, 'plugin/codeMirror/addon/comment/continuecomment'

	, 'css!plugin/codeMirror/addon/fold/foldgutter.css'
	, 'plugin/codeMirror/addon/fold/foldcode'
	, 'plugin/codeMirror/addon/fold/foldgutter'
	, 'plugin/codeMirror/addon/fold/brace-fold'
	, 'plugin/codeMirror/addon/fold/xml-fold'

	, 'plugin/codeMirror/addon/display/placeholder'
	, 'plugin/codeMirror/addon/display/panel'

	, 'plugin/codeMirror/emmet/emmet.min'
], function(cm){

	/**
	 * @constructor
	 * */
	var codeEditor = function(target, type, readOnly){
		var options = {
			lineNumbers : true
			, foldGutter: true
			, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
			, matchBrackets: true
			, indentUnit: 4
			, tabSize: 4
			//, viewportMargin: Infinity
		};

		switch(type){
			case 'html':
				options.mode = 'text/html';
				readOnly && (options.profile = 'xhtml');
				//options.name = 'htmlmixed';
				//options.scriptTypes = [{
				//	matches: /text\/jsx/i
				//	, mode: null//'text/javascript'
				//}];
				break;
			case 'css':
				options.mode = 'text/css';
				break;
			case 'js':
				options.mode = 'javascript';
				readOnly && (options.extraKeys = {
					Enter:'newlineAndIndentContinueComment'
					//, 'Ctrl-/': 'toggleComment'
				});
				break;
		}

		readOnly && (options.readOnly = !!readOnly);

		return cm.fromTextArea(target, options);
	};

	codeEditor.addPanel = function(text, target){
		var $panel
			, panel = target.panel
			, widget
			;

		if( !panel ){
			$panel = $('<div class="editor_panel"><button type="button" class="icon icon-"></button></div>');
			panel = $panel[0];

			widget = target.addPanel(panel, {position: 'bottom'});

			cm.on(panel, 'click', function(){
				widget.clear();
			});

			target.panel = panel
		}

		$panel = $(panel);

		$panel.append('<button class="editor_incFile btn icon icon-cancel" type="button" title="'+ text +'">'+ text +'</button>');
	};

	return codeEditor;
});