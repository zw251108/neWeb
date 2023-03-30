import web, {createController}      from '../web.js';
import {document, section, content} from './handler.js';

createController(web, 'document', document, {
	create: 'post'
	, update: 'post'
	, sort: 'post'
	, changeStatus: 'post'
});
createController(web, 'document/section', section, {
	create: 'post'
	, update: 'post'
	, sort: 'post'
	, changeStatus: 'post'
});
createController(web, 'document/content', content, {
	create: 'post'
	, update: 'post'
	, changeStatus: 'post'
});
createController(web, 'document/section/content', content, {
	create: 'post'
	, update: 'post'
	, changeStatus: 'post'
});

web.get('/document', (req, res)=>{
	document.list({
		creatorId: 1
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.post('/document', (req, res)=>{
	let { title } = req.body
		;

	document.create({
		title
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	})
});

web.get('/document/:id', (req, res)=>{
	let { id } = req.params
		;

	document.get({
		id
		, status: 1
		, creatorId: 1
	}, [
		'title'
		, 'sectionOrder'
	], [
		'id'
		, 'title'
		, 'contentOrder'
	], {
		status: 1
		, creatorId: 1
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.get('/document/:id/all', (req, res)=>{
	let { id } = req.params
		;

	document.document({
		id
		, creatorId: 1
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.put('/document/:id', (req, res)=>{
	let { id } = req.params
		,
		{ title } = req.body
		;

	document.update({
		id
		, title
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.get('/document/:documentId/section', (req, res)=>{
	let { documentId } = req.params
		;

	section.list({
		documentId
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.post('/document/:documentId', (req, res)=>{
	let { documentId } = req.params
		,
		{ title } = req.body
		;

	section.create({
		title
		, documentId
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	})
});

web.get('/document/:documentId/:id', (req, res)=>{
	let { id } = req.params
		;

	section.get({
		id
		, status: 1
		, creatorId: 1
	}, [
		'id'
		, 'title'
		, 'contentOrder'
	], [
		'id'
		, 'title'
		, 'content'
	], {
		status: 1
		, creatorId: 1
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.put('/document/:documentId/:id', (req, res)=>{
	let { id } = req.params
		,
		{ title } = req.body
		;

	document.update({
		id
		, title
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.get('/document/:documentId/:sectionId/content', (req, res)=>{
	let { documentId
		, sectionId } = req.params
		;

	content.list({
		documentId
		, sectionId
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.post('/document/:documentId/:sectionId', (req, res)=>{
	let { documentId
		, sectionId } = req.params
		,
		{ title
		, content } = req.body
		;

	content.create({
		title
		, content
		, documentId
		, sectionId
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.get('/document/:documentId/:sectionId/:id', (req, res)=>{
	let { id } = req.params
		;

	content.get({
		id
		, status: 1
		, creatorId: 1
	}, [
		'id'
		, 'title'
		, 'content'
	]).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});

web.put('/document/:documentId/:sectionId/:id', (req, res)=>{
	let { id
		, documentId
		, sectionId } = req.params
		,
		{ title
		, content } = req.body
		;

	content.update({
		id
		, title
		, content
		, documentId
		, sectionId
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});