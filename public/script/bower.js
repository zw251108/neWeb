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
			template: 'tr>td>button[type=button]{安装}^td{%name%}+td[title=%url%]{%url%}'
		})
		, $dialog = $('<dialog/>', {
			'class': 'module module-popup large'
		}).append('<div><button type="button" class="icon icon-cancel popup_close f-r"></button></div>' +
			'<form action="#" id="bowerSearch">' +
				'<input type="text"/>' +
				'<input type="submit" value="提交"/>' +
			'</form>' +
			'<table>' +
				'<thead><tr><th></th><th>组件名称</th><th>组件来源</th></tr></thead>' +
				'<tbody></tbody>' +
			'</table>').on('submit', '#bowerSearch', function(e){
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
		}).on('click', 'a', function(e){

		})
		;
	$('<style></style>').html('.module_content{position:relative;}' +
		'.wrap{overflow:auto;margin-left:152px;margin-bottom:10px;}' +
		'table{table-layout:fixed;}' +
		'th,td{height:100px;border:1px solid #c0c0c0;color:#000;}' +
		'.lib_table th:first-child,.lib_table td:first-child{position:absolute;left:10px;height:100px;width:150px;text-align:center;}' +
		'.module-popup{height:auto;max-height:500px;width:auto;max-width:800px;background:#fff;}' +
		'.module-popup th,.module-popup td{height:2em;}' +
		'.module-popup th:first-child,.module-popup td:first-child{width:150px;text-align:center;}' +
		'.module-popup th:last-child,.module-popup td:last-child{overflow:hidden;max-width:300px;text-overflow:ellipsis;white-space:nowrap;}' +
		'dialog{overflow:auto;padding:0;}dialog::backdrop{background:rgba(0,0,0,.5);}' +
		'.showModal{position:absolute;top:0;left:0}').appendTo('head');

	$('<button/>', {
		id: 'switch_dialog'
		, 'class': 'showModal'
		, text: '显示'
	}).on('click', function(e){
		$dialog[0].showModal();
	}).appendTo('.module_content');

	socket.on('getData', function(data){
		//console.log(data);
		if( data.topic === 'bower/search' ){
			$dialog.find('tbody').append( tableTpl(data).join('') );
		}
	});
});