/**
 * @module  document
 */
// 兼容 CommonJS 加载模式
//define('shCore', ['plugin/syntaxhighlighter', 'plugin/syntaxhighlighter/shCore'], function(){
//	return {
//		SyntaxHighlighter: SyntaxHighlighter
//	}
//});
define(['jquery', 'global', 'socket',
	'plugin/codeMirror/lib/codemirror'
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
	//, 'shCore'
	//'plugin/syntaxhighlighter/shBrushCss',
	//'plugin/syntaxhighlighter/shBrushJScript',
	//'plugin/syntaxhighlighter/shBrushXml'
	, 'template'
], function($, g, socket, cm){
	var $document = g.mod('$document') || $('#document')
		, $curr = null
		, $temp = $([])
		, dlTmpl = $.template({
			template: 'dt.icon.icon-arrow-r{%title%}+dd{%content%}'
		})
		, sectionTmpl = $.template({
			template: 'section.document_section.section>h3.section_title{%section_title%}>span.icon-CSS.icon-minus^dl{%dl%}'
			, filter: {
				dl: function(d){
					return dlTmpl(d.dl).join('');
				}
			}
		})
		, $container = g.$container
		;

	//highlight = highlight.SyntaxHighlighter;

	// 绑定 socket 回调 事件
	socket.on('getDocumentData', function(data){
		$document.data('getData', true).find('.module_content').append( sectionTmpl(data).join('') );

		//highlight.highlight();
		console.dir(cm);
		$('textarea').each(function(){
			var mode = this.className;
			if( mode === 'brush:html' ){
				cm.fromTextArea(this, {
					mode: 'text/html'
					, lineNumbers : true
					, foldGutter: true
					, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
					, indentUnit: 4
					, tabSize: 4
					, profile: 'xhtml'
					/* define Emmet output profile */
				});
			}
			else if( mode === 'brush:css' ){
				cm.fromTextArea(this, {
					mode: 'text/css'
					, lineNumbers: true
					, foldGutter: true
					, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
					, indentUnit: 4
					, tabSize: 4
				});
			}
			else if( mode === 'brush:js' ){
				cm.fromTextArea(this, {
					mode: 'javascript'
					, lineNumbers: true
					, matchBrackets: true
					, foldGutter: true
					, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
					, indentUnit: 4
					, tabSize: 4
					, extraKeys: {
						Enter:'newlineAndIndentContinueComment'
						, 'Ctrl-/': 'toggleComment'
					}
				});
			}

		});

		// 数据已加载完成
		$container.triggerHandler('dataReady');
	});

	$document.on('click', '.icon-close', function(e){
		// todo 保存未保存的数据
	}).on('click', '.section_title', function(){
			$temp.add(this)
				.find('.icon-CSS').toggleClass('icon-plus icon-minus').end()
				.next('dl').slideToggle();
	}).on('click', 'dt', function(){
		if( $curr ){
			$curr.toggleClass('icon-arrow-r icon-arrow-d');

			if( $curr.is(this) ){
				$curr.next().slideToggle();
				$curr = null;
				return;
			}
		}

		$curr && $curr.next().hide();
		$curr = $temp.add(this);

		g.$body.animate({
			scrollTop: this.offsetTop -80
		}, function(){
			$curr.toggleClass('icon-arrow-r icon-arrow-d').next().slideToggle();
		});
	});

	return $document;
});