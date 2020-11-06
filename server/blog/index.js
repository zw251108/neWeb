import web  from '../web.js';
import blog  from './handler.js';

web.get('/blog', (req, res)=>{
	let {page=1, size=10} = req.query
		;

	blog.list(page, size, {
		creatorId: 1
	}).then((data)=>{
		console.log(data);
		
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});

web.get('/blog/:id', (req, res)=>{
	let {id} = req.params
		;

	blog.get({
		id
	}).then((data)=>{
		if( data ){
			res.send({
				code: 0
				, data
			});
		}
		else{
			res.send({
				code: -1
				, msg: ''
			});
			res.end();
		}
	});
});

web.post('/blog', (req, res)=>{
	let {a} = req.body
		;

	blog.create({
		...a
	}).then((rs)=>{
		res.send({
			...rs
		});
		res.end();
	});
});

web.put('/blog/:id', (req, res)=>{
	let {id} = req.params
		, data = req.body
		;

	blog.update('');
});