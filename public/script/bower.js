/**
 * @module
 * */
require(['module/config'], function(config){

	//config.requireConfig.baseUrl = '../script/';

	var r = require.config(config.requireConfig);
	r(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		var tableTpl = $.template({
				template: 'tr>td>button[type=button]{安装}+input[type=hidden value=%name%]^td[title=%name%]{%name%}+td[title=%url%]{%url%}'
			})
			, bowerTpl  = $.template({
				template: 'tr>td{%name%}+td{%version%}+td{%css_path%}+td{%js_path%}+td>a[href=%demo_path% target=_blank]{%demo_path%}^td{%source%}+td{%homepage%}+td{%tags_html%}+td{%receipt_time%}'
				, filter: {
					css_path: function(d){
						return d.css_path ? d.css_path.split(',').map(function(d){
							return '<p>'+ d +'</p>';
						}).join('') : '';
					}
					, js_path: function(d){
						return d.js_path ? d.js_path.split(',').map(function(d){
							return '<p>'+ d +'</p>';
						}).join('') : '';
					}
					, receipt_time: function(d){
						return datetime
					}
				}
			})

			, $searchDialog = $('#result').on('submit', '#bowerSearch', function(e){
				e.preventDefault();

				var $form = $(this)
					, name = $form.find('input').val()
					;

				if( name ){
					socket.emit('data', {
						topic: 'bower/search'
						, query: {
							name: name
						}
					});
					infoLoading = true;
					$searchDialog.find('tbody').html('<tr><td colspan="3"><div class="loading loading-chasing"></div></td></tr>');
				}
			}).on('click', '.module_close', function(){
				$searchDialog.trigger('closeDialog');
			}).on('click', 'td button', function(e){
				var name =  $(this).next().val();
				socket.emit('data', {
					topic: 'bower/install'
					, query: {
						name: name
					}
				});

				$searchDialog.trigger('closeDialog');
				$infoList.html('<li><div class="loading loading-chasing"></div></li>').end().trigger('showDialog');

				console.log( name );
			})
			, $infoDialog = $('#info')
			, $infoContent = $infoDialog.find('.module_content')
			, $infoList = $infoDialog.find('#infoList')
			, infoLoading = false
			, today = new Date()
			, y = today.getFullYear()
			, m = today.getMonth() +1
			, d = today.getDate()
			, h = today.getHours()
			, mm = today.getMinutes()
			, s = today.getSeconds()
			, datetime
			;
		m = m > 10 ? '0' + m : m;
		d = d > 10 ? '0' + d : d;
		h = h > 10 ? '0' + h : h;
		mm = mm > 10 ? '0' + mm : mm;
		s = s > 10 ? '0' + s : s;
		datetime = y +'-'+ m +'-'+ d +' '+ h +':'+ mm +':'+ s;

		$('#switch_dialog').on('click', function(e){
			$searchDialog.trigger('showDialog');
		});


		//----- socket 接收事件主题注册 -----
		socket.register({
			'bower/search': function(data){
				var l = data.data.length
					, $tbody = $searchDialog.find('tbody')
					;

				l ? $tbody.html( tableTpl(data.data).join('') ) : $tbody.html('<tr><td colspan="3">没有相关信息</td></tr>');
			}
			, 'bower/info': function(data){console.log(data);
				var msg = data.info
					;

				$infoList.find('li:last').before('<li>' +
						'<span class="bower_level">' + msg.level + '</span>' +
						'<span class="bower_id">' + msg.id + '</span>' +
						'<span class="bower_message">' + msg.message + '</span>' +
					'</li>');
				$infoContent.scrollTop( $infoContent[0].scrollHeight );
			}
			//, 'bower/install': function(data){
			//
			//}
			, 'bower/install/prompts': function(data){console.log(data);
				var info = data.info;

				$infoList.append('<li>' +
						$.map(info, function(d){
							return '<div class="formGroup">' +
								'<label>' +
									'<input type="radio" name="pick" />' +
									d.name + ' ' + d.version +
								'</label> required by' +
								$.map(d.required, function(d){
								return d.name + ' ' + d.version;
							}).join() +
							'</div>';
						}).join('') +
					'</li>');
			}
			, 'bower/install/end': function(data){console.log(data)
				var info = data.info;

				$infoList.find('li:last').replaceWith('<li>' +
						'<span class="bower_level">end</span>' +
						'<span class="bower_id">' + info.name + ' ' + info.version + '</span>' +
						'<span class="bower_message">安装完成</span>' +
					'</li>');

			}
		});
	});
});