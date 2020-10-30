import db       from './db.js';
import web      from './web.js';
import socket   from './socket.js';
import CONFIG   from '../config.js';

import './user/index.js';

let server = web.listen(CONFIG.PORT, ()=>{
		console.log('web server is listening');
	})
	;

socket.init( server );

// socketServer.init( server );

db.authenticate().then((e)=>{
	if( e ){
		console.log(e);
		return;
	}
	
	console.log('database connect success');
});