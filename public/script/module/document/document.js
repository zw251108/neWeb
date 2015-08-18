/**
 * @module  document/document
 * */
define(['jquery', 'global', 'socket', 'codeEditor', 'template'], function($, g, socket, code){
	var $document = g.mod('$document') || $('#document')
		, $curr = null
		, $temp = $([])
		, dlTmpl = $.template({
			template: 'dt.icon.icon-right{%title%}+dd{%content%}'
		})
		, sectionTmpl = $.template({
			template: 'section.document_section.section>h3.section_title{%section_title%}>span.icon.icon-down^dl{%dl%}'
			, filter: {
				dl: function(d){
					return dlTmpl(d.dl).join('');
				}
			}
		})
		, $container = g.$container
		;

	// 绑定 socket 回调 事件
	socket.register({
		document: function(data){
			$document.data('data', true).find('.module_content').append( sectionTmpl(data.data).join('') );

			// 数据已加载完成
			$container.triggerHandler('dataReady');
		}
	});

	$document.on('click', '.icon-close', function(e){
		// todo 保存未保存的数据
	}).on('click', '.section_title', function(){
			$temp.add(this)
				.find('.icon').toggleClass('icon-up icon-down').end()
				.next('dl').slideToggle();
	}).on('click', 'dt', function(){
		if( $curr ){
			$curr.toggleClass('icon-right icon-down');

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
			$curr.toggleClass('icon-right icon-down').next().slideToggle();

			!$curr.data('codeMirror') && $curr.data('codeMirror', true).next().find('textarea').each(function(){
				code(this, 'dataset' in this ? this.dataset.codeType : this.getAttribute('data-code-type'), true);
			});
		});
	})
	;

	return $document;
});