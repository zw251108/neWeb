import Blog from './blog/model.js';
import db   from './db.js';

Blog.create({
	title: 'test'
}).then((blog)=>{
	console.log( JSON.stringify(blog.toJSON(), null, 4) );
});


// db.authenticate().then((e)=>{
// 	if( e ){
// 		console.log(e);
// 		return;
// 	}
//
// 	console.log('database connect success');
// });