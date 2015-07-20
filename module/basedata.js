'use strict';
/**
 *
 * */

var db          = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, Promise   = require('promise')

	/**
	 * @namespace   BaseData
	 * */
	, BaseData  = {
		/**
		 * @namespace   Model
		 * @memberof    BaseData
		 * @desc    业务相关 sql 语句集合
		 * */
		Model: {
			province:   'select * from basedata_province'
			, city:     'select * from basedata_city where province=?'
			, district: 'select * from basedata_district where city=?'
			, town:     'select * from basedata_town where district=?'
			, village:  'select * from basedata_village where town=?'
		}

		/**
		 * @namespace   Handler
		 * @memberof    BaseData
		 * @desc    数据处理方法集合
		 * */
		, Handler: {}

		/**
		 * @namespace   View
		 * @memberof    BaseData
		 * @desd    视图模板集合
		 * */
		, View: {}
	}
	;

web.get('/data/province', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		;

	db.handle({
		sql: BaseData.Model.province
	}).then(function(rs){
		rs = JSON.stringify( rs.result );

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});
web.get('/data/city', function(req, res){
	var query = req.query || {}
		, province = query.province
		, callback = query.callback
		;

	if( province ){

		db.handle({
			sql: BaseData.Model.city
			, data: [province]
		}).then(function(rs){
			rs = JSON.stringify( rs.result );

			res.send( callback ? callback +'('+ rs +')' : rs );
			res.end();
		});
	}
	else{
		res.send('[]');
		res.end();
	}
});
web.get('/data/district', function(req, res){
	var query = req.query || {}
		, city = query.city
		, callback = query.callback
		;

	if( city ){

		db.handle({
			sql: BaseData.Model.district
			, data: [city]
		}).then(function(rs){
			rs = JSON.stringify( rs.result );

			res.send( callback ? callback +'('+ rs +')' : rs );
			res.end();
		});
	}
	else{
		res.send('[]');
		res.end();
	}
});
web.get('/data/town', function(req, res){
	var query = req.query || {}
		, district = query.district
		, callback = query.callback
		;

	if( district ){

		db.handle({
			sql: BaseData.Model.town
			, data: [district]
		}).then(function(rs){
			rs = JSON.stringify( rs.result );

			res.send( callback ? callback +'('+ rs +')' : rs );
			res.end();
		});
	}
	else{
		res.send('[]');
		res.end();
	}
});
web.get('/data/village', function(req, res){
	var query = req.query || {}
		, town = query.town
		, callback = query.callback
		;

	if( town ){

		db.handle({
			sql: BaseData.Model.village
			, data: [town]
		}).then(function(rs){
			rs = JSON.stringify( rs.result );

			res.send( callback ? callback +'('+ rs +')' : rs );
			res.end();
		});
	}
	else{
		res.send('[]');
		res.end();
	}
});

socket.register({
	province: function(socket){
		db.handle({
			sql: BaseData.Model.province
		}).then(function(rs){
			rs = rs.result;

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
			;

		if( province ){

			db.handle({
				sql: BaseData.Model.city
				, data: [province]
			}).then(function(rs){
				rs = rs.result;

				send.data = rs;
				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
	, district: function(socket, data){
		var send = {
				topic: 'district'
			}
			, query = data.query || {}
			, city = query.city
			;
		if( city ){

			db.handle({
				sql: BaseData.Model.district
				, data: [city]
			}).then(function(rs){
				rs = rs.result;

				send.data = rs;
				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
	, town: function(socket, data){
		var send = {
				topic: 'town'
			}
			, query = data.query || {}
			, district = query.district
			;

		if( district ){

			db.handle({
				sql: BaseData.Model.town
				, data: [district]
			}).then(function(rs){
				rs = rs.result;

				send.data = rs;
				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
	, village: function(socket, data){
		var send = {
				topci: 'village'
			}
			, query = data.query || {}
			, town = query.town
			;

		if( town ){

			db.handle({
				sql: BaseData.Model.village
				, data: [town]
			}).then(function(rs){
				rs = rs.result;

				send.data = rs;
				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
});

module.exports = BaseData;