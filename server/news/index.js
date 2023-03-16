import web  from '../web.js';
import news from './handler.js';
import tag  from '../tag/handler.js';

web.get('/news', (req, res)=>{
	let { page = 1
		, size = 20 } = req.query
		;

	// todo creatorId 从 session 中取
	news.list({
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

web.post('/news', (req, res)=>{
	let data = req.body
		;

	news.create({
		...data
	}).then((rs)=>{
		res.send({
			...rs
		});
		res.end();
	});
});