import web, {createController} from '../web.js';
import news                    from './handler.js';
// import tag                     from '../tag/handler.js';

createController(web, 'news', news, {
	create: 'post'
	, update: 'post'
	, changeStatus: 'post'
	, weight: 'post'
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
		, 'weight'
		, 'password'
		, 'createDate'
	], [
		['weight', 'DESC']
		, ['createDate', 'DESC']
	]).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data: data.map((item)=>{
				let id = item.getDataValue('id')
					, type = item.getDataValue('type')
					, targetId = item.getDataValue('targetId')
					, content = item.getDataValue('content')
					, weight = item.getDataValue('weight')
					, password = item.getDataValue('password')
					, createDate = item.getDataValue('createDate')
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
				};
			})
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