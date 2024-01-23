import web, {createController} from '../web.js';
import valhalla                from './handler.js';

createController(web, 'valhalla', valhalla, {
	create: 'post'
	, update: 'post'
	, weight: 'post'
});

web.get('/valhalla', (req, res)=>{
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
		res.send({
			code: 0
			, data
		});
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
	});
});