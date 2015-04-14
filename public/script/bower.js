/**
 * @module
 * */
require(['module/config'], function(config){
	require.config(config);
	require(['jquery', 'template', 'socket'], function($, tpl, socket){
		var tableTpl = tpl({
				template: 'tr>td>button[type=button]{安装}+input[type=hidden value=%name%]^td{%name%}+td[title=%url%]{%url%}'
			})

			, $dialog = $('#result').find('.module_content')
				.append('<form action="#" id="bowerSearch">' +
				'<input class="input" type="text"/><button class="btn icon icon-search" type="submit" value=""></button>' +
				'</form>' +
				'<div class="bower_resultList">' +
				'<table><thead><tr><th></th><th>组件名称</th><th>组件来源</th></tr></thead><tbody></tbody></table>' +
				'</div>').end().on('submit', '#bowerSearch', function(e){
					e.preventDefault();

					var $form = $(this);

					socket.emit('getData', {
						topic: 'bower/search'
						, query: {
							name: $form.find('input').val()
						}
					});
				}).on('click', '.popup_close', function(){
					$dialog[0].close();
				}).on('click', 'td button', function(e){
					var name =  $(this).next().val();
					socket.emit('getData', {
						topic: 'bower/install'
						, query: {
							name: name
						}
					});
					$dialog[0].close();
					$infoDialog[0].showModal();

					console.log( name );
				})
			;

		$('#switch_dialog').on('click', function(e){
			$dialog[0].showModal();
		});

		var $infoDialog = $('#info');
		//	$('<dialog/>', {
		//	'class': 'module module-popup big'
		//	, id: 'info'
		//}).append('<ul></ul>').appendTo('body');

		//----- socket 接收事件主题注册 -----
		socket.register({
			'bower/search': function(data){
				var l = data.data.length
					, $tbody = $dialog.find('tbody')
					;
				l ? $tbody.append( tableTpl(data.data).join('') ) : $tbody.append('<tr><td colspan="3">没有相关信息</td></tr>');
			}
			, 'bower/info': function(data){
				var msg = data.msg;
				$infoDialog.find('ul').append('<li><span class="bower_level">' +
				msg.level + '</span><span class="bower_id">' +
				msg.id + '</span><span class="bower_message">' +
				msg.message + '</span></li>');
				console.log(data);
			}
			//, 'bower/install': function(data){
			//
			//}
			, 'bower/install/prompts': function(data){
				console.log(data);
				var info = data.info;
				$infoDialog.find('ul').append('<li>' +
				$.map(info, function(d){
					return '<div class="formGroup"><label><input type="radio" name="pick" />' +
						d.name + ' ' +
						d.version + '</label> required by' +
						$.map(d.required, function(d){
							return d.name + ' ' + d.version;
						}).join() + '</div>';
				}).join('') + '</li>');
			}
			, 'bower/install/end': function(data){console.log(data)
				$infoDialog.find('ul').append($.map(data.info, function(d){
					return '<li><span class="bower_level">end</span><span class="bower_id">' +
						d.name + ' ' + d.version + '</span><span class="bower_message">安装完成</span></li>'
				}).join(''));
			}
		});
	});
});