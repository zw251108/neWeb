'use strict';

var CONFIG  = require('../../config.js')
	, web       = require('../web.js')
	, socket    = require('../socket.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, UserHandler   = require('../user/handler.js')

	, BaseDataAdminView = require('./admin.view.js')
	, BaseDataHandler   = require('./handler.js')
	;

/**
 * Web 数据接口
 * */
// 地区数据
web.get('/basedata/province/data', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	BaseDataHandler.getProvince(user, query).then(function(rs){
		res.send( JSON.stringify({
			data: rs
			, msg: 'Done'
		}) );
		res.end();
	});
});
web.get('/basedata/city/data', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	BaseDataHandler.getCity(user, query).then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.get('/basedata/district/data', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	BaseDataHandler.getDistrict(user, query).then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.get('/basedata/town/data', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	BaseDataHandler.getTown(user, query).then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.get('/basedata/village/data', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	BaseDataHandler.getVillage(user, query).then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});

// 大学数据
web.get('/basedata/university/data', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	BaseDataHandler.getUniversity(user, query).then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
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
	, href: 'address/'
});
web.get('/admin/address/', function(req, res){
	var user = UserHandler.getUserFromSession.fromReq( req )
		;

	BaseDataAdminView.province( user ).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});


/**
 * Web Socket 数据接口
 * */
socket.register({
	province: function(socket, data){
		var topic = 'province'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		BaseDataHandler.getProvince(user, query).then(function(rs){
			socket.emit('data', {
				topic: topic
				, data: rs
				, msg: 'Done'
			});
		});
	}
	, city: function(socket, data){
		var topic = 'city'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		BaseDataHandler.getCity(user, query).then(function(rs){
			return {
				topic: topic
				, data: rs
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, district: function(socket, data){
		var topic = 'district'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		BaseDataHandler.getDistrict(user, query).then(function(rs){
			return {
				topic: topic
				, data: rs
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, town: function(socket, data){
		var topic = 'town'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		BaseDataHandler.getTown(user, query).then(function(rs){
			return {
				topic: topic
				, data: rs
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, village: function(socket, data){
		var topic = 'village'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		BaseDataHandler.getVillage(user, query).then(function(rs){
			return {
				topic: topic
				, data: rs
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}

	, university: function(socket, data){
		var topic = 'university'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		BaseDataHandler.getUniversity(user, query).then(function(rs){
			return {
				topic: topic
				, data: rs
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
});

/**
 * 全局 Web 数据接口 只支持 jsonp 格式，回调函数参数名为 callback
 * */
data.push('province', 'city', 'district', 'town', 'village', 'university');

// 地区数据
web.get('/data/province', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		, callback = query.callback
		, execute
		;

	if( callback ){
		execute = BaseDataHandler.getProvince(user, query);
	}
	else{
		execute = BaseDataHandler.getError('不是 jsonp 格式调用');
		callback = 'console.log';
	}

	execute.then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( callback +'('+ JSON.stringify(json) +')' );
		res.end();
	});
});
web.get('/data/city', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		, callback = query.callback
		, execute
		;

	if( callback ){
		execute = BaseDataHandler.getCity(user, query);
	}
	else{
		execute = BaseDataHandler.getError('不是 jsonp 格式调用');
		callback = 'console.log';
	}

	execute.then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( callback +'('+ JSON.stringify(json) +')' );
		res.end();
	});
});
web.get('/data/district', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		, callback = query.callback
		, execute
		;

	if( callback ){
		execute = BaseDataHandler.getDistrict(user, query);
	}
	else{
		execute = BaseDataHandler.getError('不是 jsonp 格式调用');
		callback = 'console.log';
	}

	execute.then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( callback +'('+ JSON.stringify(json) +')' );
		res.end();
	});
});
web.get('/data/town', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		, callback = query.callback
		, execute
		;

	if( callback ){
		execute = BaseDataHandler.getTown(user, query);
	}
	else{
		execute = BaseDataHandler.getError('不是 jsonp 格式调用');
		callback = 'console.log';
	}

	execute.then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( callback +'('+ JSON.stringify(json) +')' );
		res.end();
	});
});
web.get('/data/village', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		, callback = query.callback
		, execute
		;

	if( callback ){
		execute = BaseDataHandler.getVillage(user, query);
	}
	else{
		execute = BaseDataHandler.getError('不是 jsonp 格式调用');
		callback = 'console.log';
	}

	execute.then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( callback +'('+ JSON.stringify(json) +')' );
		res.end();
	});
});

// 大学数据
web.get('/data/university', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		, callback = query.callback
		, execute
		;

	if( callback ){
		execute = BaseDataHandler.university(user, query);
	}
	else{
		execute = BaseDataHandler.getError('不是 jsonp 格式调用');
		callback = 'console.log';
	}

	execute.then(function(rs){
		return {
			data: rs
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( callback +'('+ JSON.stringify(json) +')' );
		res.end();
	});
});