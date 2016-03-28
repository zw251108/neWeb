'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, admin = require('../admin.js')
	, data  = require('../data.js')

	, BaseDataError = require('./error.js')
	, BaseDataModel = require('./model.js')
	, BaseDataAdminView = require('./admin.view.js')
	, BaseDataHandler   = require('./handler.js')
	;

/**
 * Web 数据接口
 * */
// 地区数据
web.get('/basedata/province/data', function(req, res){
	BaseDataHandler.getProvince().then(function(rs){
		res.send( JSON.stringify(rs) );
		res.end();
	});
});
web.get('/basedata/city/data', function(req, res){
	var query = req.query || {}
		, province = query.province
		, execute
		;

	if( province ){
		execute = BaseDataModel.city( province ).then(function(rs){
			return JSON.stringify( rs );
		});
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 province') );
	}

	execute.catch(function(e){
		console.log( e );

		return '[]';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});
web.get('/basedata/district/data', function(req, res){
	var query = req.query || {}
		, city = query.city
		, execute
		;

	if( city ){
		execute = BaseDataModel.district( city ).then(function(rs){
			return JSON.stringify( rs );
		});
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 city') );
	}

	execute.catch(function(e){
		console.log( e );

		return '[]';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});
web.get('/basedata/town/data', function(req, res){
	var query = req.query || {}
		, district = query.district
		, execute
		;

	if( district ){
		execute = BaseDataModel.town( district ).then(function(rs){
			return JSON.stringify( rs );
		});
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 district') );
	}

	execute.catch(function(e){
		console.log( e );

		return '[]';
	}).then(function(rs){
		res.send( rs );
		res.end();
	});
});
web.get('/basedata/village/data', function(req, res){
	var query = req.query || {}
		, town = query.town
		, execute
		;

	if( town ){
		execute = BaseDataModel.village( town ).then(function(rs){
			return JSON.stringify( rs );
		});
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 town') );
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
web.get('/basedata/university/data', function(req, res){
	var query = req.query || {}
		, province = query.province
		, execute
		;

	if( province ){
		execute = BaseDataModel.university( province ).then(function(rs){
			rs = JSON.stringify( rs );

			return callback +'('+ rs +')';
		});
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 province') );
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
 * 后台管理
 * */
admin.register({
	id: 'basedata'
	, metroSize: 'tiny'
	, title: '基础数据 data'
	, icon: 'tags'
	, href: 'basedata/'
});
web.get('/admin/address', function(req, res){
	BaseDataAdminView.province().then(function(html){
		res.send();
	});
});


/**
 * 全局 Web 数据接口 只支持 jsonp 格式，回调函数名为 callback
 * */
data.push('province', 'city', 'district', 'town', 'village', 'university');

// 地区数据
web.get('/data/province', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		, execute
		;

	if( callback ){
		execute = BaseDataHandler.getProvince().then(function(rs){
			return callback +'('+ JSON.stringify( rs ) +')';
		});
	}
	else{
		execute = Promise.reject( new BaseDataError('不是 jsonp 格式调用') );
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
			execute = BaseDataModel.city( province ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 province') );
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
			execute = BaseDataModel.district( city ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 city') );
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
			execute = BaseDataModel.town( district ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 district') );
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
			execute = BaseDataModel.village( town ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 town') );
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
web.get('/data/university', function(req, res){
	var query = req.query || {}
		, province = query.province
		, callback = query.callback
		, execute
		;

	if( province ){
		if( callback ){
			execute = BaseDataModel.university( province ).then(function(rs){
				rs = JSON.stringify( rs );

				return callback +'('+ rs +')';
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('不是 jsonp 格式调用') );
		}
	}
	else{
		execute = Promise.reject( new BaseDataError('缺少参数 province') );
	}

	execute.catch(function(e){
		console.log( e );

		return '';
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
		BaseDataModel.province().then(function(rs){
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
			execute = BaseDataModel.city( province ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('缺少参数 province') );
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
			execute = BaseDataModel.district( city ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('缺少参数 city') );
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
			execute = BaseDataModel.town( district ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('缺少参数 district') );
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
	, village: function(socket, data){
		var send = {
				topic: 'village'
			}
			, query = data.query || {}
			, town = query.town
			, execute
			;

		if( town ){
			execute = BaseDataModel.village( town ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('缺少参数 town') );
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

	, university: function(socket, data){
		var send = {
				topic: 'university'
			}
			, query = data.query || {}
			, province = query.province
			, execute
			;

		if( province ){
			execute = BaseDataModel.university( province ).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new BaseDataError('缺少参数 province') );
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
});