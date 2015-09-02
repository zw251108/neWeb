define(['jquery', 'socket'], function(){
	return function(topic){}
});

/**
 * data 模块基于 ajax
 * */
define(['jquery'], function($){



	return function(topic, data, param){
		param = param || {};

		return $.ajax(topic, {
			data: data
		})
	}
});