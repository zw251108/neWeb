import web, {createController} from '../web.js';
import blog                    from './handler.js';
// import tag                     from '../tag/handler.js';

createController(web, 'blog', blog, {
	create: 'post'
	, update: 'post'
	, changeStatus: 'post'
	, setPwd: 'post'
	, rmPwd: 'post'
});

web.get('/blog', (req, res)=>{
	let { page = 1
		, size = 20
		, title
		, tags
		, id } = req.query
		, status = 1
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
		exec = blog.list({
			title
			, tags
			, creatorId: 1
			, status
			, page
			, size
		}, [
			'id'
			, 'title'
			, 'short'
			, 'status'
			, 'createDate'
			, 'updateDate'
		]);
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
		;

	// todo creatorId 从 session 中取
	blog.get({
		id
		, creatorId: 1
	}, [
		'id'
		, 'status'
		, 'title'
		, 'content'
		, 'tags'
		, 'createDate'
	]).then((data)=>{
		if( data ){
			let status = data.getDataValue('status')
				, id = data.getDataValue('id')
				, title = data.getDataValue('title')
				, content = data.getDataValue('content')
				, tags = data.getDataValue('tags')
				, createDate = data.getDataValue('createDate')
				, date = new Date( createDate )
				, y = date.getFullYear()
				, m = date.getMonth() + 1
				, d = date.getDate()
				, h = date.getHours()
				, mm = date.getMinutes()
				, s = date.getSeconds()
				;

			createDate = `${y}-${m > 9 ? m : '0'+ m}-${d > 9 ? d : '0'+ d} ${h > 9 ? h : '0'+ h}:${mm > 9 ? mm : '0'+ mm}:${s > 9 ? s : '0'+ s}`;

			try{
				tags = JSON.parse( tags );
			}
			catch(e){
				tags = [];
			}

			if( status === 0 ){
				res.send({
					code: -1
					, msg: ''
				});
			}
			else if( status === 3 ){
				res.send({
					code: 0
					, data: {
						id
						, status
						, title
						, tags
						, createDate
					}
				})
			}
			else{
				res.send({
					code: 0
					, data
				});
			}
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
		id
		, ...data
	}).then((rs)=>{
		res.send({
			...rs
		});
		res.end();
	});
});