import web  from '../web.js';
import data from './handler.js';

web.get('/data', (req, res)=>{

});

web.get('/data/planet', (req, res)=>{
	let {id} = req.query
		;

	data.getPlanet({
		id
	}).then((data)=>{
		res.send( JSON.stringify({
			code: 0
			, data
		}) );
		res.end();
	})
});