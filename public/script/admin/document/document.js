/**
 *
 * */
require(['../../config'], function(config){
	config.requireConfig.baseUrl = location.origin +'/script/';

	var r = require(config.requireConfig);
	r(['jquery', 'global', 'socket', config.dataSource.skin, 'codeEditor', 'codeEditorSkin', 'msgPopup', 'template'], function($, g, socket, skin, code, codeSkin, msgPopup){
		var $document = $('#document')
			, $curr = null
			, $temp = $([])
			, sectionListTpl = $.template({
				template: 'dt.icon.icon-right[data-content-id=%Id%]{%title%}>button.icon.icon-up[type=button title=上移]+button.icon.icon-down[type=button title=下移]^dd>textarea[data-code-type=html]{%content%}+button.btn.btn-submit[type=button]{保存}'
			})
			, sectionTpl = $.template({
				template: 'section.document_section.section[data-section-id=%sectionId%]>h3.section_title{%sectionTitle%}>button.icon.icon-plus[type=button title=添加章节]+button.icon.icon-up[type=button title=上移]+button.icon.icon-down[type=button title=下移]+button.icon.icon-save[type=button title=保存排序]^dl{%sectionList%}'
				, filter: {
					sectionList: function(d){
						return sectionListTpl(d.dl).join('');
					}
				}
			})
			, $addSectionPopup = $('#addSectionPopup').on('click', '#addSection', function(){
				var $title = $addSectionPopup.find('#newSectionTitle')
					, title = $title.val()
					;
				if( title ){
					$.ajax({
						url: 'add'
						, type: 'POST'
						, data: {
							title: title
							, order: $document.find('.document_section').length +1
						}
						, dataType: 'json'
						, success: function(json){
							if( json.success ){

								$title.val('');

								$document.find('.module_content').append( sectionTpl({
									sectionId: json.id
									, sectionTitle: title
									, dl: []
								}).join('') );
								$addSectionPopup.trigger('closeDialog');

								msgPopup.showMsg(title +' 章节创建成功！');
								$save.trigger('click', [true]);
							}
							else{

							}
						}
					});
				}
			})
			, $addContentPopup = $('#addContentPopup').on('click', '#addContent', function(){
				var $title = $addContentPopup.find('#contentTitle')
					, title = $title.val()
					, sectionId = $addContentPopup.find('#sectionId').val()
					, sectionTitle = $addContentPopup.find('#sectionTitle').val()
					, $section = $document.find('.module_content .section[data-section-id="'+ sectionId +'"]')
					;

				if( title ){
					$.ajax({
						url: sectionId +'/add'
						, type: 'POST'
						, data: {
							title: title
							, sectionId: sectionId
							, sectionTitle: sectionTitle
							, order: $section.find('dt').length +1
						}
						, dataType: 'json'
						, success: function(json){
							if( json.success ){

								$title.val('');

								$section.find('dl').append( sectionListTpl({
									Id: json.id
									, title: title
								}).join('') );
								$addContentPopup.trigger('closeDialog');

								msgPopup.showMsg(title +' 小节创建成功！');

								$section.find('.icon-save').trigger('click', [true]);
							}
							else{

							}
						}
					});
				}
			})
			, $save = $document.find('#save')
			, codeList = []
			, skinList
			;

		skin = $.parseJSON( skin );
		skinList = codeSkin(skin.skin, config.requireConfig.baseUrl, codeList);

		$document.on('click', '#save', function(e, hideMsg){
			var order = $document.find('.section').map(function(){
					return $(this).data('sectionId');
				}).get().join()
				;

			$.ajax({
				url: 'save'
				, type: 'POST'
				, dataType: 'json'
				, data: {
					order: order
				}
				, success: function(json){
					if( json.success ){
						!hideMsg && msgPopup.showMsg('章节排序，保存成功！');
					}
				}
			});
		})
			.on('click', '#add', function(){
			$addSectionPopup.trigger('showDialog');
		})
			.on('click', '.section_title', function(){
			$temp.add(this).find('.section_title span.icon').toggleClass('icon-up icon-down').end().next('dl').slideToggle();
		})
			.on('click', '.section_title .icon-plus', function(e){
			e.stopImmediatePropagation();

			var $that = $(this).parents('.section');

			$addContentPopup.find('#sectionId').val( $that.data('sectionId') );
			$addContentPopup.find('#sectionTitle').val( $that.find('.section_title').text() );

			$addContentPopup.trigger('showDialog');
		})
			.on('click', '.section_title .icon-up', function(e){
			e.stopImmediatePropagation();

			var $that = $(this).parents('.section');

			if( !$that.is(':first') ){
				$that.insertBefore( $that.prev() );
			}
		})
			.on('click', '.section_title .icon-down', function(e){
			e.stopImmediatePropagation();

			var $that = $(this).parents('.section');

			if( !$that.is(':last') ){
				$that.insertAfter( $that.next() );
			}
		})
			.on('click', '.section_title .icon-save', function(e, hideMsg){
			e.stopImmediatePropagation();

			var $that = $(this).parents('.section')
				, sectionId = $that.data('sectionId')
				, order = $that.find('dt').map(function(){
					return $(this).data('contentId')
				}).get().join()
				;

			$.ajax({
				url: sectionId +'/save'
				, type: 'POST'
				, dataType: 'json'
				, data: {
					order: order
				}
				, success: function(json){
					if( json.success ){
						!hideMsg && msgPopup.showMsg('内容排序，保存成功！');
					}
				}
			});
		})
			.on('click', 'dt', function(){
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

				if( !$curr.data('codeMirror') ){
					$curr.next().find('textarea').each(function(){
						var c = code(this, 'dataset' in this ? this.dataset.codeType : this.getAttribute('data-code-type'));

						codeList.push( c );

						skinList.setSkin();

						$curr.data('codeMirror', c);
					}).end().find('.CodeMirror').addClass('edit_CodeMirror');
				}
			});
		})
			.on('click', 'dt .icon-up', function(e){
			e.stopImmediatePropagation();

			var $that = $(this).parents('dt')
				, $next = $that.next()
				;

			if( !$that.is(':first') ){
				$that.insertBefore( $that.prev().prev() );
				$next.insertAfter( $that );
			}
		})
			.on('click', 'dt .icon-down', function(e){
			e.stopImmediatePropagation();

			var $that = $(this).parents('dt')
				, $next = $that.next()
				;

			if( !$that.next().is(':last') ){
				$that.insertAfter( $next.next().next() );
				$next.insertAfter( $that );
			}
		})
			.on('click', 'dd .btn', function(e){
			e.stopImmediatePropagation();

			var $that = $(this)
				, $content = $that.parents('dd').prev()
				, $section = $content.parents('section')

				, code = $content.data('codeMirror')
				, contentId = $content.data('contentId')
				, sectionId = $section.data('sectionId')
				;

			$.ajax({
				url: sectionId +'/'+ contentId +'/save'
				, type: 'POST'
				, data: {
					id: contentId
					, content: code.getValue().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;')
				}
				, dataType: 'json'
				, success: function(json){
					if( json.success ){
						msgPopup.showMsg('内容保存成功！');
					}
				}
			})
		});
	});
});