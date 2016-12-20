var origin = location.origin
	, socket
	;

window.onerror = function(e){
	console.log(e);
};

if( !('console' in window) ){
	window.console = {};
}
if( 'log' in window.console ){
	window.console._log = window.console.log;
}
window.console.log = function(){

	// todo 发生错误信息

	window.console._log && window.console._log.apply(window.console, arguments);
};

if( 'WebSocket' in window ){
	socket = new WebSocket('ws://127.0.0.1:8181');

	socket.onclose = function(e){
		console.log('error', e );
	};
	socket.onopen = function(e){
		console.log( e );

		socket.send(123);
	};
	socket.onmessage = function(e){
		var data = e.data
			;

		try{
			data = JSON.parse( data );
		}
		catch(e){}

		console.log('message', data)
	}
}