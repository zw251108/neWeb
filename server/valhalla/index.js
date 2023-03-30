import web, {createController} from '../web.js';
import valhalla                from './handler.js';

createController(web, 'valhalla', valhalla, {
	create: 'post'
	, update: 'post'
});

web.get('/valhalla', (req, res)=>{
	// todo creatorId 从 session 中取
	valhalla.all({}, [
		'id'
		, 'name'
		, 'path'
		, 'start'
		, 'end'
		, 'description'
		, 'weight'
	], [
		['weight', 'DESC']
		, ['id', 'ASC']
	], ['src']).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
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

	valhalla.update({
		...data
		, id
	}).then((rs)=>{
		res.send({
			...rs
		});
		res.end();
	});
});