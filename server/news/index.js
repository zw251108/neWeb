import web, {createController} from '../web.js';
import {formatDate}            from '../lib.js';
import news                    from './handler.js';
// import tag                     from '../tag/handler.js';

createController(web, 'news', news, {
	create: 'post'
	, update: 'post'
	, changeStatus: 'post'
	, weight: 'post'
});

web.get('/news', (req, res)=>{
	let { search
		, filter = ''
		, page = 1
		, size = 20 } = req.query
		;

	// todo creatorId 从 session 中取
	news.news({
		search
		, filter
		, page
		, size
	}).then((data)=>{
		res.send({
			code: 0
			, data: data.map((item)=>{
				let id = item.getDataValue('id')
					, type = item.getDataValue('type')
					, targetId = item.getDataValue('targetId')
					, content = item.getDataValue('content')
					, weight = item.getDataValue('weight')
					, password = item.getDataValue('password')
					, createDate = formatDate( item.getDataValue('createDate') )
					, updateDate = formatDate( item.getDataValue('updateDate') )
					;

				try{
					content = JSON.parse( content );
				}
				catch(e){
					content = {};
				}

				if( password ){
					if( type === 'blog' ){
						delete content.content;
					}
					else if( type === 'img' ){
						delete content.src;
					}
				}

				return {
					id
					, type
					, targetId
					, content
					, weight
					, password
					, createDate
					, updateDate
				};
			})
		});
	});
});

web.get('/news/:id', (req, res)=>{
	let { id } = req.params
		;

	news.get({
		id
		, creatorId: 1
		, status: 1
    }, [
		'id'
		, 'type'
		, 'targetId'
		, 'content'
		, 'createDate'
	]).then((data)=>{
		res.send({
			code: 0
			, data
		});
	});
})

web.post('/news', (req, res)=>{
	let data = req.body
		;

	news.create({
		...data
	}).then((rs)=>{
		res.send({
			...rs
		});
	});
});