/**
 *
 * */
require(['/script/config.js'], function(config){
	var r = require( config );
	r(['jquery', 'global', 'socket'
		, 'text!data-skin', 'codeEditor', 'codeEditorSkin'
		, 'template'
	], function($, g, socket, skin, code, codeSkin){
		var $document = g.mod('$document') || $('#document')
			, $toolbar = $document.find('.toolbar')
			, $curr = null
			, $temp = $([])
			, dlTpl = $.template({
				template: 'dt.icon.icon-right{%title%}+dd{%content%}'
			})
			, sectionTpl = $.template({
				template: 'section.document_section.section>h3.section_title{%section_title%}>i.icon.icon-down^dl{%dl%}'
				, filter: {
					dl: function(d){
						return dlTpl(d.dl).join('');
					}
				}
			})
			, $container = g.$container
			, codeList = []
			, hash = location.hash
			;

		skin = $.parseJSON( skin );
		codeSkin = codeSkin(skin.skin, config.baseUrl, codeList);

		// 绑定 socket 回调 事件
		socket.register({
			document: function(data){
				$document.data('data', true).find('.module_content').append(sectionTpl(data.data).join(''));

				// 数据已加载完成
				$container.triggerHandler('dataReady');
			}
		});

		$document.on('click', '.section_title', function(){
			$temp.add(this)
				.find('.icon').toggleClass('icon-up icon-down').end()
				.next('dl').slideToggle();

			location.hash = $temp.add(this).find('a').attr('name');
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

			location.hash = $temp.add(this).find('a').attr('name');

			g.$body.animate({
				scrollTop: this.offsetTop + $toolbar.height()
			}, function(){
				$curr.toggleClass('icon-right icon-down').next().slideToggle();

				!$curr.data('codeMirror') && $curr.data('codeMirror', true).next().find('textarea').each(function(){
					var c = code(this, this.dataset ? this.dataset.codeType : this.getAttribute('data-code-type'), true);

					codeList.push(c);
					codeSkin.setSkin();
				});
			});
		});

		// hash change
		if( hash ){
			hash = hash.split('-');

			if( hash[1] ){
				// $document.find('section:not(:eq('+ hash[1] +')) .section_title').trigger('click');

				if( hash[2] ){
					$document.find('section:eq('+ (hash[1] -1) +') dt:eq('+ hash[2] +')').trigger('click');
				}
				else{
					$document.find('section:eq('+ hash[1] +') dt:eq(0)').trigger('click');
				}
			}
		}
	});
});