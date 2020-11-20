import web  from '../web.js';
import blog from './handler.js';
import tag  from '../tag/handler.js';

web.get('/blog', (req, res)=>{
	let {page=1, size=10} = req.query
		;

	// todo creatorId 从 session 中取
	blog.list({
		creatorId: 1
	}, page, size).then((data)=>{
		let idList = data.map((b)=>{
				return b.id;
			})
			;



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
	let data = req.body
		;

	blog.create({
		...data
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

	blog.update({
		...data
	}, {
		id
	}).then((rs)=>{
		res.send({
			...rs
		});
		res.end();
	});
});