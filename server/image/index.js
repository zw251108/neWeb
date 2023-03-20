import web, {createController} from '../web.js';
import {album, image}          from './handler.js';

createController(web, 'album', album, {});
createController(web, 'image', image, {});
createController(web, 'img', image, {});
createController(web, 'album/image', image, {});
createController(web, 'album/img', image, {});

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
	});
});

web.get('/album/:id', (req, res)=>{
	let { id } = req.params
		;

	album.get({
		id
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});

web.get('/image/:id', (req, res)=>{
	let { id } = req.params
		;

	image.get({
		id
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});