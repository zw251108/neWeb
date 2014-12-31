/**
 * @module  tag
 * */
//----- 标签数据 Tag -----
define('tag', ['jquery', 'socket', 'template'], function($, socket){
	var Tag = {
		tagTmpl: $.template({
			template: 'span.tag[data-tagid=%Id%]{%name%}'
		})
	};
	socket.emit('getData', {
		topic: 'tag'
		, receive: 'getTagData'
	});

	socket.on('getTagData', function(data){
		Tag.data = data;
	}).on('addTag', function(){
		socket.emit('addTag', {
			name: ''
		});
	});

	return Tag;
});