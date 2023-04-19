import web, {createController, formatDate} from '../web.js';
import blog                                from './handler.js';
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
		, tags } = req.query
		, status = 1
		;

	// todo creatorId 从 session 中取

	blog.list({
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
	]).then((data)=>{
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
		{ answer } = req.query
		;

	// todo creatorId 从 session 中取
	blog.get({
		id
		, creatorId: 1
		, answer
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
				, tags = data.getDataValue('tags')
				, createDate = formatDate( data.getDataValue('createDate') )
				;

			tags = tags.split(',');

			if( status === 0 ){
				res.send({
					code: -1
					, msg: ''
				});
			}
			else if( status === 3 ){    // 密码访问
				if( answer ){
					res.send({
						code: 0
						, data
					});
				}
				else{
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

web.get('/blog/:id/answer', ()=>{

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