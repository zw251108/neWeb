import db       from './db.js';
import './web.js';

import './basedata/index.js';
import './tag/index.js';
import './user/index.js';
import './blog/index.js';
import './document/index.js';
import './todo/index.js';

import './news/index.js';
import './image/index.js';
import './valhalla/index.js';
import './mg/page/index.js';
import './mg/code/index.js';
import './editor/index.js';
import './wx/index.js';
import './wb/index.js';

// 外部数据
import './book/index.js';
import './game/index.js';
import './movie/index.js';

db.authenticate().then((e)=>{
	if( e ){
		console.log(e);
		return;
	}
	
	console.log('database connect success');
});