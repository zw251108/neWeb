import db       from './db.js';
import './web.js';

import './basedata/index.js';
import './tag/index.js';
import './user/index.js';
import './blog/index.js';
import './document/index.js';
import './todo/index.js';

db.authenticate().then((e)=>{
	if( e ){
		console.log(e);
		return;
	}
	
	console.log('database connect success');
});