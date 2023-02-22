import web      from '../web.js';
import bookmark from './handler.js';

web.get('/bookmark', (req, res)=>{
	bookmark.list({

	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.post('/bookmark', (req, res)=>{
	let data = req.body
		;

	bookmark.create( data ).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});

web.post('/bookmark/read', (req, res)=>{
	let data = req.body
		;

	bookmark.read( data ).then(()=>{

	});
});

web.get('/reader', (req, res)=>{
	res.send( JSON.stringify({
		code: 0
		, data: []
	}) );
	res.end();
});