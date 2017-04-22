'use strict';



/**
 * @function    ajax
 * @param   {String}    topic
 * @param   {Object}    options
 * */
function ajax(topic, options){

	return new Promise(function(resolve, reject){
		let result
			;
		if( 'fetch' in self ){
			result = Promise.reject();
		}
	});

	let xhr = new XMLHttpRequest();

	xhr.open('POST', '//mServ.test.66buy.com.cn/publics/memberIdentity/upload', true);
	xhr.withCredentials = true;
	xhr.onprogress = function(e){
		console.log(e.lengthComputable);
		console.log(e.size);
		console.log(e.loaded);
	};
	xhr.onload = function(e){
		console.log(e)
	};
	xhr.send( formData );
}

export default ajax;