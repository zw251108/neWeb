import web, {createController} from '../web.js';
import editor                  from './handler.js';

createController(web, 'editor', editor, {
	create: 'post'
	, update: 'post'
	, changeStatus: 'post'
});

web.get('/editor', (req, res)=>{

});

web.get('/editor/:id', (req, res)=>{
	let { id } = req.params
		;

	editor.get({
		id
		, status: 1
		, creatorId: 1
	}, [
		'id'
		, 'name'
		, 'html'
		, 'css'
		, 'js'
		, 'tags'
		, 'createDate'
	]).then((data)=>{
		if( data ){
			res.send({
				data
				, code: 0
			});
		}
		else{
			res.send({
				code: -1
				, msg: ''
			});
		}
	});
});