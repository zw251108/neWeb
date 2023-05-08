import web, {createController}                           from '../web.js';
import {album, image, uploadMiddleware, upload, uploads} from './handler.js';

createController(web, 'album', album, {
	create: 'post'
	, update: 'post'
});
createController(web, 'image', image, {
	create: 'post'
	, update: 'post'
	, upload: 'post'
});
createController(web, 'img', image, {
	create: 'post'
	, update: 'post'
	, upload: 'post'
});
createController(web, 'album/image', image, {
	create: 'post'
	, update: 'post'
	, upload: 'post'
});
createController(web, 'album/img', image, {
	create: 'post'
	, update: 'post'
	, upload: 'post'
});

web.post('/image/upload', uploadMiddleware.single('image'), (req, res)=>{
	upload( req ).then(function(data){
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	}, (e)=>{
		res.send( JSON.stringify({
			code: -1
			, msg: e.message
		}) );
		res.end();
	});
});

web.post('/image/uploads', uploadMiddleware.array('images'), (req, res)=>{
	uploads( req ).then(function(data){
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	}, (e)=>{
		res.send( JSON.stringify({
			code: -1
			, msg: e.message
		}) );
		res.end();
	});
});

web.get('/album', (req, res)=>{
	let { page = 1
		, size = 20 } = req.query
		;

	album.list({
		creatorId: 1
		, page
		, size
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.get('/album/:id', (req, res)=>{
	let { id } = req.params
		;

	album.get({
		id
		, includeImage: false
	}, [
		'id'
		, 'name'
	], [
		'id'
		, 'src'
		, 'width'
		, 'height'
		, 'desc'
	]).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.get('/album/:id/imgs', (req, res)=>{
	let { id } = req.params
		,
		{ page = 1
		, size = 20 } = req.query
		;

	image.list({
		albumId: id
		, page
		, size
		, creatorId: 1
	}, [
		'id'
		, 'src'
		, 'width'
		, 'height'
		, 'desc'
	], [
		['id', 'ASC']
	]).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	})
});

web.get('/image/:id', (req, res)=>{
	let { id } = req.params
		;

	image.get({
		id
	}, [
		'id'
		, 'src'
		, 'width'
		, 'height'
		, 'desc'
		, 'tags'
		, 'createDate'
	]).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.get('/image/:id/next', (req, res)=>{
	let { id } = req.params
		,
		{ albumId
		, num = 1 } = req.query
		;

	image.getNext({
		id
		, albumId
		, creatorId: 1
		, size: num
	}, [
		'id'
		, 'src'
		, 'width'
		, 'height'
		, 'desc'
		, 'tags'
		, 'createDate'
	]).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.get('/image/:id/prev', (req, res)=>{
	let { id } = req.params
		,
		{ albumId
		, num = 1 } = req.query
		;

	image.getPrev({
		id
		, albumId
		, creatorId: 1
		, size: num
	}, [
		'id'
		, 'src'
		, 'width'
		, 'height'
		, 'desc'
		, 'tags'
		, 'createDate'
	]).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data: data.reverse()
		}) );
		res.end();
	});
});

web.get('/image/:id/sibling', (req, res)=>{
	let { id } = req.params
		,
		{ albumId
		, num = 1 } = req.query
		;

	Promise.all([
		image.getPrev({
			id
			, albumId
			, creatorId: 1
			, size: num
		}, [
			'id'
			, 'src'
			, 'width'
			, 'height'
			, 'desc'
			, 'tags'
			, 'createDate'
		])
		, image.getNext({
			id
			, albumId
			, creatorId: 1
			, size: num
		}, [
			'id'
			, 'src'
			, 'width'
			, 'height'
			, 'desc'
			, 'tags'
			, 'createDate'
		])
	]).then(([prev, next])=>{
		res.send( JSON.stringify({
			code: 0
			, data: {
				prev
				, next
			}
		}) );
		res.end();
	})
});