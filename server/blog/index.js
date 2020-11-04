import web  from '../web.js';
import Blog from './model.js';

web.get('/blog', (req, res)=>{
	let {page=1, size=10} = req.query
		;

	Blog.findAll({
		attributes: ['id', 'title', 'updateDate', 'tags', 'tagList']
		, where: {
			creatorId: 1
		}
		, order: [
			['id', 'DESC']
		]
		, offset: (page -1)* size
		, limit: size
	}).then((data)=>{
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

	Blog.findOne({
		where: {
			id
		}
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
	let {a} = req.body
		;

	Blog.create({
		...a
	}).then((rs)=>{
		res.send({
			...rs
		});
	});
});

web.put('/blog/:id', (req, res)=>{

});