import web  from '../web.js';
import image  from './handler.js';

web.get('/album', (req, res)=>{
	let { page = 1
		, size = 20 } = req.query
		;

	image.list({
		creatorId: 1
	}, page, size).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});

web.get('/album/:id', (req, res)=>{
	let { id } = req.params
		;

	image.album({
		id
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});

web.get('/image/:id', (req, res)=>{
	let { id } = req.params
		;

	image.get({
		id
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});