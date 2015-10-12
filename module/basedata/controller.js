'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, admin = require('../admin.js')
	, data  = require('../data.js')

	, Model = require('./model.js')
	, Admin = require('./admin.view.js')
	, DataError = require('./error.js')
	;

web.get('/admin/province', function(req, res){
	Admin.province().then(function(html){
		res.send();
	});
});
admin.push('province');

/**
 * 全局 Web 数据接口 只支持 jsonp 格式，回调函数名为 callback
 * */
// 地区数据
web.get('/data/province', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		, execute
		;

	if( callback ){
		execute = Model.province().then(function(rs){
			rs = JSON.stringify( rs );

			return callback +'('+ rs +')';
		});
	}
	else{
		execute = Promise.reject( new DataError('不是 jsonp 格式调用') );
	}

	execute.catch(function(e){
		console.log(e);

		return '';
	}).then(function(rs){
		rs && res.send( rs );
		res.end();
	});
});
web.get('/data/city', function(req, res){
	var query = req.query || {}
		, province = query.province
		, callback = query.callback
		, execute
		;

	if( province ){
		if( callback ){
			execute = Model.city( province ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new DataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 province') );
	}

	execute.catch(function(e){
		console.log( e );

		return '';
	}).then(function(rs){
		rs && res.send( rs );
		res.end();
	});
});
web.get('/data/district', function(req, res){
	var query = req.query || {}
		, city = query.city
		, callback = query.callback
		, execute
		;

	if( city ){
		if( callback ){
			execute = Model.district( city ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new DataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 city') );
	}

	execute.catch(function(e){
		console.log( e );

		return '';
	}).then(function(rs){
		rs && res.send( rs );
		res.end();
	});
});
web.get('/data/town', function(req, res){
	var query = req.query || {}
		, district = query.district
		, callback = query.callback
		, execute
		;

	if( district ){
		if( callback ){
			execute = Model.town( district ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new DataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 district') );
	}

	execute.catch(function(e){
		console.log( e );

		return '';
	}).then(function(rs){
		rs && res.send( rs );
		res.end();
	});
});
web.get('/data/village', function(req, res){
	var query = req.query || {}
		, town = query.town
		, callback = query.callback
		, execute
		;

	if( town ){
		if( callback ){
			execute = Model.village( town ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new DataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 town') );
	}

	execute.catch(function(e){
		console.log( e );

		return '';
	}).then(function(rs){
		rs && res.send( rs );
		res.end();
	});
});

// 大学数据
web.get('/university/data', function(req, res){
	var query = req.query || {}
		, province = query.province
		, callback = query.callback
		, execute
		;

	if( province ){
		if( callback ){
			execute = Model.university( province ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new DataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 province') );
	}

	execute.catch(function(e){
		console.log( e );

		return '';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});
data.push('province', 'city', 'district', 'town', 'village', 'university');

/**
 * Web 数据接口
 * */
// 地区数据
web.get('/province/data', function(req, res){
	Model.province().then(function(rs){
		res.send( JSON.stringify( rs ) );
		res.end();
	});
});
web.get('/city/data', function(req, res){
	var query = req.query || {}
		, province = query.province
		, execute
		;

	if( province ){
		execute = Model.city( province ).then(function(rs){
			return JSON.stringify( rs );
		});
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 province') );
	}

	execute.catch(function(e){
		console.log( e );

		return '[]';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});
web.get('/district/data', function(req, res){
	var query = req.query || {}
		, city = query.city
		, execute
		;

	if( city ){
		execute = Model.district( city ).then(function(rs){
			return JSON.stringify( rs );
		});
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 city') );
	}

	execute.catch(function(e){
		console.log( e );

		return '[]';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});
web.get('/town/data', function(req, res){
	var query = req.query || {}
		, district = query.district
		, execute
		;

	if( district ){
		execute = Model.town( district ).then(function(rs){
			return JSON.stringify( rs );
		});
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 district') );
	}

	execute.catch(function(e){
		console.log( e );

		return '[]';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});
web.get('/village/data', function(req, res){
	var query = req.query || {}
		, town = query.town
		, execute
		;

	if( town ){
		execute = Model.village( town ).then(function(rs){
			return JSON.stringify( rs );
		});
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 town') );
	}

	execute.catch(function(e){
		console.log( e );

		return '[]';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});

// 大学数据
web.get('/university/data', function(req, res){
	var query = req.query || {}
		, province = query.province
		, execute
		;

	if( province ){
		execute = Model.university( province ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback +'('+ rs +')';
		});
	}
	else{
		execute = Promise.reject( new DataError('缺少参数 province') );
	}

	execute.catch(function(e){
		console.log( e );

		return '[]';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});

/**
 * Web Socket 数据接口
 * */
socket.register({
	province: function(socket){
		Model.province().then(function(rs){
			socket.emit('data', {
				topic: 'province'
				, data: rs
			});
		});
	}
	, city: function(socket, data){
		var send = {
				topic: 'city'
			}
			, query = data.query || {}
			, province = query.province
			, execute
			;

		if( province ){
			execute = Model.city( province ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new DataError('缺少参数 province') );
		}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, district: function(socket, data){
		var send = {
				topic: 'district'
			}
			, query = data.query || {}
			, city = query.city
			, execute
			;

		if( city ){
			execute = Model.district( city ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new DataError('缺少参数 city') );
		}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, town: function(socket, data){
		var send = {
				topic: 'town'
			}
			, query = data.query || {}
			, district = query.district
			, execute
			;

		if( district ){
			execute = Model.town( district ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new DataError('缺少参数 district') );
		}

		execute.catch(function(e){
			console.log(e);

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, village: function(socket, data){
		var send = {
				topic: 'village'
			}
			, query = data.query || {}
			, town = query.town
			, execute
			;

		if( town ){
			execute = Model.village( town ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new DataError('缺少参数 town') );
		}

		execute.catch(function(e){
			console.log(e);

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}

	, university: function(socket, data){
		var send = {
				topic: 'university'
			}
			, query = data.query || {}
			, province = query.province
			, execute
			;

		if( province ){
			execute = Model.university( province ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new DataError('缺少参数 province') );
		}

		execute.catch(function(e){
			console.log(e);

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
});