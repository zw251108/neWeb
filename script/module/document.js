/**
 * @module  document
 */
// 兼容 CommonJS 加载模式
define('shCore', ['plugin/syntaxhighlighter', 'plugin/syntaxhighlighter/shCore'], function(){
	return {
		SyntaxHighlighter: SyntaxHighlighter
	}
});
define(['jquery', 'global', 'socket', 'shCore', 'template',
	'plugin/syntaxhighlighter/shBrushCss',
	'plugin/syntaxhighlighter/shBrushJScript',
	'plugin/syntaxhighlighter/shBrushXml'
], function($, g, socket, highlight){
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

	highlight = highlight.SyntaxHighlighter;

	// 绑定 socket 回调 事件
	socket.on('getDocData', function(data){
		$document.data('getData', true).find('.module_content').append( sectionTmpl(data).join('') );

		highlight.highlight();

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