/**
 * @module
 * */
require(['module/config'], function(config){
	require.config(config);
	require(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		var tableTpl = $.template({
				template: 'tr>td>button[type=button]{安装}+input[type=hidden value=%name%]^td[title=%name%]{%name%}+td[title=%url%]{%url%}'
			})

			, $searchDialog = $('#result').on('submit', '#bowerSearch', function(e){
					e.preventDefault();

					var $form = $(this);

					socket.emit('getData', {
						topic: 'bower/search'
						, query: {
							name: $form.find('input').val()
						}
					});
				}).on('click', '.module_close', function(){
					$searchDialog.trigger('closeDialog');
				}).on('click', 'td button', function(e){
					var name =  $(this).next().val();
					socket.emit('getData', {
						topic: 'bower/install'
						, query: {
							name: name
						}
					});

					$searchDialog.trigger('closeDialog');
					$infoDialog.trigger('showDialog');

					console.log( name );
				})
			, $infoDialog = $('#info')
			;

		$('#switch_dialog').on('click', function(e){
			$searchDialog.trigger('showDialog');
		});


		//----- socket 接收事件主题注册 -----
		socket.register({
			'bower/search': function(data){
				var l = data.data.length
					, $tbody = $searchDialog.find('tbody')
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