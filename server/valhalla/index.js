import web  from '../web.js';
import valhalla from './handler.js';

web.get('/valhalla', (req, res)=>{
	let { page = 1
		, size = 40 } = req.query
		;

	// todo creatorId 从 session 中取
	valhalla.list({}, page, size).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});

web.post('/valhalla', (req, res)=>{
	let data = req.body
		;

	valhalla.create({
		...data
	}).then((rs)=>{
		res.send({
			...rs
		});
		res.end();
	});
});

web.put('/valhalla/:id', (req, res)=>{
	let { id } = req.params
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