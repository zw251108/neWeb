import web, {createController} from '../web.js';
import news                    from './handler.js';
// import tag                     from '../tag/handler.js';

createController(web, 'news', news, {
	create: 'post'
	, update: 'post'
	, changeStatus: 'post'
});

web.get('/news', (req, res)=>{
	let { page = 1
		, size = 20 } = req.query
		;

	// todo creatorId 从 session 中取
	news.list({
		status: 1
		, creatorId: 1
		, page
		, size
	}, [
		'id'
		, 'type'
		, 'targetId'
		, 'content'
		, 'createDate'
	]).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
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