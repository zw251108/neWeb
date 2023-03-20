import web, {createController} from '../web.js';
import tag                     from './handler.js';

createController(web, 'tag', tag, {
	create: 'post'
	, update: 'post'
});

web.get('/tag', (req, res)=>{
	let { name
		, page = 1
		, size = 20 } = req.query
		;

	tag.list({
		name
		, creatorId: 1
		, page
		, size
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.post('/tag', (req, res)=>{
	let { name
		, description } = req.body
		;

	tag.create({
		name
		, description
		, creatorId: 1
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.put('/tag/:id', (req, res)=>{
	let { id } = req.params
		,
		{ name
		, description } = req.body
		;

	tag.update({
		id
		, name
		, description
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});

web.put('/tag/:id/increase', (req, res)=>{
	tag.increase('test').then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});