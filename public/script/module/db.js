/**
 * db 模块基于 socket.io
 * */
define(['jquery', 'socket'], function(){
	return function(topic){}
});

/**
 * db 模块基于 ajax
 * */
define(['jquery'], function($){



	return function(topic, data, param){
		param = param || {};

		return $.ajax(topic, {
			data: data
		})
	}
});