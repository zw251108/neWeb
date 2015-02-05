/**
 *
 * */

require.config({
	paths: {
		jquery: 'lib/jquery.min'
		, template: 'ui/jquery.emmetTpl'
		, socket: 'module/socket'
	}
});
require(['jquery', 'template', 'socket'], function($, tpl, socket){
	var tableTpl = tpl({
			template: 'tr>td>button[type=button]{安装}+input[type=hidden value=%name%]^td{%name%}+td[title=%url%]{%url%}'
		})
		, $dialog = $('<dialog/>', {
			'class': 'module module-popup big'
		}).append('<div><button type="button" class="icon icon-cancel popup_close f-r"></button></div>' +
			'<form action="#" id="bowerSearch"><input type="text"/><input type="submit" value="提交"/></form>' +
			'<table><thead><tr><th></th><th>组件名称</th><th>组件来源</th></tr></thead><tbody></tbody></table>'
		).on('submit', '#bowerSearch', function(e){
			e.preventDefault();

			var $form = $(this);

			socket.emit('getData', {
				topic: 'bower/search'
				, query: {
					name: $form.find('input').val()
				}
			});
		}).appendTo('body').on('click', '.popup_close', function(){
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
	$('<style></style>').html('.module_content{position:relative;}' +
		'.wrap{overflow:auto;margin-left:152px;margin-bottom:10px;}' +
		'table{table-layout:fixed;}' +
		'th,td{height:100px;border:1px solid #c0c0c0;color:#000;}' +
		'.lib_table th:first-child,.lib_table td:first-child{position:absolute;left:10px;height:100px;width:150px;text-align:center;}' +
		'li{overflow: hidden;}' +
		'.bower_level{float:left; min-width: 80px; margin:0 10px;color:red;}.bower_level:before{content:"["}.bower_level:after{content:"]"}' +
		'.bower_id{float: left; min-width: 120px; margin: 0 10px;color:green}' +
		'.bower_message{float: left; margin: 0 0 0 20px;}' +
		'.module-popup{height:auto;max-height:500px;background:#fff;}' +
		'.module-popup th,.module-popup td{height:2em;}' +
		'.module-popup th:first-child,.module-popup td:first-child{width:150px;text-align:center;}' +
		'.module-popup th:last-child,.module-popup td:last-child{overflow:hidden;max-width:300px;text-overflow:ellipsis;white-space:nowrap;}' +
		'dialog{overflow:auto;padding:0;}dialog::backdrop{background:rgba(0,0,0,.5);}' +
		'.showModal{position:absolute;top:0;left:0}').appendTo('head');

	$('<button/>', {
		id: 'switch_dialog'
		, 'class': 'icon icon-search showModal'
		, text: '显示'
	}).on('click', function(e){
		$dialog[0].showModal();
	}).appendTo('.module_content');

	var $infoDialog = $('<dialog/>', {
		'class': 'module module-popup big'
		, id: 'info'
	}).append('<ul></ul>').appendTo('body');

	//----- socket 接收事件主题注册 -----
	socket.register({
		'bower/search': function(data){
			$dialog.find('tbody').append( tableTpl(data.data).join('') );
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
				info.map(function(d){
					return '<div class="formGroup"><label><input type="radio" name="pick" />' +
						d.name + ' ' +
						d.version + '</label> required by' +
						d.required.map(function(d){
							return d.name + ' ' + d.version;
						}).join() + '</div>';
				}).join('') + '</li>');
		}
		, 'bower/install/end': function(data){console.log(data)
			$infoDialog.find('ul').append(data.info.map(function(d){
				return '<li><span class="bower_level">end</span><span class="bower_id">' +
				d.name + ' ' + d.version + '</span><span class="bower_message">安装完成</span></li>'
			}).join(''));
		}
	});
});