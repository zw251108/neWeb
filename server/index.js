import db       from './db.js';
import './web.js';

import './user/index.js';
import './blog/index.js';

db.authenticate().then((e)=>{
	if( e ){
		console.log(e);
		return;
	}
	
	console.log('database connect success');
});