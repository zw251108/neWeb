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
require(['jquery'
	, 'template'
	, 'socket'
], function($
	, tpl
	, socket){
	var searchRsTpl = tpl({
			template: 'li>span.name{%name%}+span.git{%url%}'
		})
		, tableTpl = tpl({
			template: 'tr>td>label>input[type=radio]{%name%}^^td{%url%}'
		})
		, $dialog = $('<dialog/>', {
			'class': 'module module-popup normal'
		}).append('<form action="#" id="bowerSearch"><input type="text"/><input type="submit" value="提交"/></form>' +
			'<table><colgroup span="1"><col style="width:100px;" class="col"/></colgroup><thead><tr><td>组件名称</td><td>组件来源</td></tr></thead><tbody></tbody></table>')
			.on('submit', function(e){

			e.preventDefault();
			var $form = $(this);

			socket.emit('bower_search', $form.find('input').val());

		}).appendTo('body')
		;
	$('<style></style>').html('.module_content{position:relative;}' +
		'.wrap{overflow:auto;margin-left:152px;margin-bottom:10px;}' +
		'.lib_table th,.lib_table td{height:100px;border:1px solid #c0c0c0;color:#000;}' +
		'.lib_table th:first-child,.lib_table td:first-child{position:absolute;left:10px;height:100px;width:150px;text-align:center;}' +
		'td:first-child{width:150px;}' +
		'.module-popup{background:#fff;}' +
		'dialog{overflow:auto;}dialog::backdrop{background:rgba(0,0,0,.5);}' +
		'button{position:absolute;top:0;left:0}').appendTo('head');

	$('<button/>', {
		id: 'switch_dialog'
		, text: '显示'
	}).on('click', function(e){
		var text = this.innerHTML;
		if( text === '显示' ){
			this.innerHTML = '隐形';
			$dialog[0].showModal();
		}
		else if( text === '隐形' ){
			this.innerHTML = '显示';
			$dialog[0].close()
		}
	}).appendTo('.module_content');

	socket.on('bower_search_result', function(data){
		//console.log(data);
		$dialog.find('tbody').append( tableTpl(data).join('') );
	});
});