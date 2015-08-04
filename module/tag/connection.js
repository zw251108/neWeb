var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, Model = require('./Model.js')
	;

/**
 * Web 数据接口 支持 jsonp 格式
 * */
web.get('/tag/data', function(req, res){
	var query = req.query || {}
		, callback = query.callback
		;

	Model.tag().then(function(rs){
		rs = JSON.stringify( rs );

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});
web.get('/tag/increase', function(){
	res.end();
});

/**
 * Web Socket 数据接口
 * */
socket.register({
	tag: function(socket){

		Model.tag().then(function(rs){

			socket.emit('data', {
				topic: 'tag'
				, data: rs
			});
		});
	}
	, 'tag/add': function(socket, data){
		var send = {
				topic: 'tag/add'
			}
			, query = data.query || {}
			, name = query.name
			;

		if( name ){
			Model.tagAdd( name ).then(function(rs){

				if( !rs.insertId ){
					send.info = {
						id: rs.insertId
						, name: name
					}
				}
				else{
					send.error = '';
					send.msg = '该标签已存在';
				}

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
	, 'tag/increase': function(socket, data){
		var send = {
				topic: 'tag/increase'
			}
			, query = data.query || {}
			, name = query.tagName
			, num = query.num || 1
			;

		if( name ){
			Model.tagIncrease(name, num).then(function(rs){
				rs = rs.result;

				if( rs.changedRows ){
					send.info = {
						name: name
					};
				}

				// 标签数量添加
				if( name in Tag.index ){
					Tag.data[Tag.index[name]] += 1;
				}
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
});