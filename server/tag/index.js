import web  from '../web.js';
import tag  from './handler.js';

web.post('/tag', (req, res)=>{
	let data = req.body
		;

	tag.create({
		creatorId: 1
		, name: 'test'
		, num: 1
	}).then((rs)=>{
		res.send( rs );
		res.end();
	});
});

web.put('/tag/increase', (req, res)=>{

	tag.increase('test').then((data)=>{
		res.send( data );
		res.end();
	});
});