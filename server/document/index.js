import web  from '../web.js';
import document from './handler.js';

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

web.get('/document/:id', (req, res)=>{
	let {id} = req.params
		;

	document.document({
		id
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});

web.post('/document/:id', (req, res)=>{

});

web.get('/document/:id/:sectionId', (req, res)=>{
	let {sectionId} = req.params
		;

	document.contentList({
		sectionId
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
	});
});

web.get('/document/:id/:sectionId/:contentId', (req, res)=>{
	let {contentId} = req.params
		;

	document.get({
		id: contentId
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	});
});