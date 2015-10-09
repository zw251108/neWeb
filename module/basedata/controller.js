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
		;

	Model.province().then(function(rs){
		rs = JSON.stringify( rs );

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});
web.get('/data/city', function(req, res){
	var query = req.query || {}
		, province = query.province
		, callback = query.callback
		, result
		;

	if( province ){
		result = Model.city( province ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 province') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();

	}, function(e){
		console.log( e );

		res.send('[]');
		res.end();
	});
});
web.get('/data/district', function(req, res){
	var query = req.query || {}
		, city = query.city
		, callback = query.callback
		, result
		;

	if( city ){
		result = Model.district( city ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 city') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();
	}, function(e){
		console.log( e );

		res.send('[]');
		res.end();
	});
});
web.get('/data/town', function(req, res){
	var query = req.query || {}
		, district = query.district
		, callback = query.callback
		, result
		;

	if( district ){
		result = Model.town( district ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 district') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();
	}, function(e){
		console.log( e );

		res.send('[]');
		res.end();
	});
});
web.get('/data/village', function(req, res){
	var query = req.query || {}
		, town = query.town
		, callback = query.callback
		, result
		;

	if( town ){
		result = Model.village( town ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 town') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();
	}, function(e){
		console.log( e );

		res.send('[]');
		res.end();
	});
});

// 大学数据
web.get('/university/data', function(req, res){
	var query = req.query || {}
		, province = query.province
		, callback = query.callback
		, result
		;

	if( province ){
		result = Model.university( province ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 province') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();
	}, function(e){
		console.log( e );

		res.send('[]');
		res.end();
	});
});
data.push('province', 'city', 'district', 'town', 'village', 'university');

/**
 * Web 数据接口
 * */
// 地区数据
web.get('/province/data', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		;

	Model.province().then(function(rs){
		rs = JSON.stringify( rs );

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});
web.get('/city/data', function(req, res){
	var query = req.query || {}
		, province = query.province
		, callback = query.callback
		, result
		;

	if( province ){
		result = Model.city( province ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 province') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();

	}, function(e){
		console.log( e );

		res.send('[]');
		res.end();
	});
});
web.get('/district/data', function(req, res){
	var query = req.query || {}
		, city = query.city
		, callback = query.callback
		, result
		;

	if( city ){
		result = Model.district( city ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 city') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();
	}, function(e){
		console.log( e );

		res.send('[]');
		res.end();
	});
});
web.get('/town/data', function(req, res){
	var query = req.query || {}
		, district = query.district
		, callback = query.callback
		, result
		;

	if( district ){
		result = Model.town( district ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 district') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();
	}, function(e){
		console.log( e );

		res.send('[]');
		res.end();
	});
});
web.get('/village/data', function(req, res){
	var query = req.query || {}
		, town = query.town
		, callback = query.callback
		, result
		;

	if( town ){
		result = Model.village( town ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 town') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();
	}, function(e){
		console.log( e );

		res.send('[]');
		res.end();
	});
});

// 大学数据
web.get('/university/data', function(req, res){
	var query = req.query || {}
		, province = query.province
		, callback = query.callback
		, result
		;

	if( province ){
		result = Model.university( province ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback ? callback +'('+ rs +')' : rs;
		});
	}
	else{
		result = Promise.reject( new DataError('缺少参数 province') );
	}

	result.then(function(rs){
		res.send( rs );
		res.end();
	}, function(e){
		console.log( e );

		res.send('[]');
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
			, result
			;

		if( province ){
			result = Model.city( province ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			result = Promise.reject( new DataError('缺少参数 province') );
		}

		result.then(function(send){
			socket.emit('data', send);
		}, function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			socket.emit('data', send);
		});
	}
	, district: function(socket, data){
		var send = {
				topic: 'district'
			}
			, query = data.query || {}
			, city = query.city
			, result
			;

		if( city ){
			result = Model.district( city ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			result = Promise.reject( new DataError('缺少参数 city') );
		}

		result.then(function(send){
			socket.emit('data', send);
		}, function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			socket.emit('data', send);
		});
	}
	, town: function(socket, data){
		var send = {
				topic: 'town'
			}
			, query = data.query || {}
			, district = query.district
			, result
			;

		if( district ){
			result = Model.town( district ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			result = Promise.reject( new DataError('缺少参数 district') );
		}

		result.then(function(send){
			socket.emit('data', send);
		}, function(e){
			console.log(e);

			send.error = '';
			send.msg = e.message;

			socket.emit('data', send);
		});
	}
	, village: function(socket, data){
		var send = {
				topic: 'village'
			}
			, query = data.query || {}
			, town = query.town
			, result
			;

		if( town ){
			result = Model.village( town ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			result = Promise.reject( new DataError('缺少参数 town') );
		}

		result.then(function(send){
			socket.emit('data', send);
		}, function(e){
			console.log(e);

			send.error = '';
			send.msg = e.message;

			socket.emit('data', send);
		});
	}

	, university: function(socket, data){
		var send = {
				topic: 'university'
			}
			, query = data.query || {}
			, province = query.province
			, result
			;

		if( province ){
			result = Model.university( province ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			result = Promise.reject( new DataError('缺少参数 province') );
		}

		result.then(function(send){
			socket.emit('data', send);
		}, function(e){
			console.log(e);

			send.error = '';
			send.msg = e.message;

			socket.emit('data', send);
		});
	}
});