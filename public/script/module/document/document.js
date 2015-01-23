/**
 * @module  document
 * */
define(['jquery', 'global', 'socket'
	, 'plugin/codeMirror/lib/codemirror'
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

	// 绑定 socket 回调 事件
	socket.on('getDocumentData', function(data){
		$document.data('getData', true).find('.module_content').append( sectionTmpl(data).join('') );

		// 数据已加载完成
		$container.triggerHandler('dataReady');
	});

	$document.on('click', '.icon-close', function(e){
		// todo 保存未保存的数据
	}).on('click', '.section_title', function(){
			$temp.add(this)
				.find('.icon').toggleClass('icon-plus icon-minus').end()
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

			!$curr.data('codeMirror') && $curr.data('codeMirror', true).next().find('textarea').each(function(){
				var mode = this.className;
				if( mode === 'brush:html' ){
					mode = 'text/html';
				}
				else if( mode === 'brush:css' ){
					mode = 'text/css';
				}
				else if( mode === 'brush:js' ){
					mode = 'javascript';
				}

				cm.fromTextArea(this, {
					mode: mode
					, lineNumbers : true
					, foldGutter: true
					, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
					, matchBrackets: true
					, readOnly: true
				});
			});
		});
	})
	;

	return $document;
});