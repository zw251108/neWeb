let getDataSucc = (res, data)=>{
		res.send( JSON.stringify({
			data
			, msg: 'Done'
		}) );
		res.end();
	}
	, getDataError = (res, e)=>{
		res.send( JSON.stringify({
			msg: e.message
		}) );
		res.end();
	}
	;

module.exports = {
	getDataSucc
	, getDataError
};