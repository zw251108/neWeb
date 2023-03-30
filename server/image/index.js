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