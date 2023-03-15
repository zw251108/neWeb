import web  from '../web.js';
import blog from './handler.js';
import tag  from '../tag/handler.js';

web.get('/blog', (req, res)=>{
	let { page = 1
		, size = 20
		, title
		, tags
		, id
		, status } = req.query
		, exec
		;

	// todo creatorId 从 session 中取

	if( id ){
		exec = blog.get({
			id
			, creatorId: 1
			, status
		});
	}
	else{
		blog.list({
			title
			, tags
			, creatorId: 1
			, status
		}, page, size);
	}

	exec.then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.get('/blog/:id', (req, res)=>{
	let { id } = req.params
		,
		{ status } = req.query
		;
	     console.log(status)
	// todo creatorId 从 session 中取
	blog.get({
		id
		, creatorId: 1
		, status
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
		}

		res.end();
	});
});

web.post('/blog', (req, res)=>{
	let data = req.body
		,
		{ id } = data
		, exec
		;

	// todo creatorId 从 session 中取

	if( id ){
		exec = blog.update({
			...data
		}, {
			id
		});
	}
	else{
		exec = blog.create({
			...data
			, creatorId: 1
		});
	}

	exec.then(({dataValues})=>{
		res.send({
			code: 0
			, data: {
				id: dataValues.id
			}
		});
		res.end();
	});
});

web.put('/blog/:id', (req, res)=>{
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