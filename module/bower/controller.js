'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config.js')

	, Promise   = require('promise')

	, index     = require('../index.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')
	, BowerError    = require('./error.js')

	, Bower = require('./bower.js')

	, PROMPT_CALLBACK_CACHE = []
	, PROMPT_CALLBACK_INDEX = {}
	;

// 注册首页 metro 模块
index.push({
	id: 'bower'
	, type: 'metro'
	, size: 'normal'
	, title: '组件 bower'
});

web.get('/bower/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getBowerByPage(page, size).then(function(rs){
		return Model.countBower().then(function(count){
			return {
				data: rs
				, index: page
				, size: size
				, count: count
				, urlCallback: function(index){
					return '?page='+ index;
				}
			}
		});
	}).then( View.bowerList ).catch(function(){console.log(arguments)}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

socket.register({
	bower: function(socket, data){}
	, 'bower/editor/lib': function(socket, data){}

	, 'bower/search': function(socket, data){
		var send = {
				topic: 'bower/search'
			}
			, query = data.query || {}
			, name = query.name
			;

		if( name ){
			Bower.search( name).then(function(rs){
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
	, 'bower/install': function(socket, data){
		var send = {
				topic: 'bower/install/end'
			}
			, query = data.query || {}
			, name = query.name
			, index
			;

		if( name ){
			Model.isExistBower( name ).then(function(isExist){
				var rs;
				if( isExist ){
					socket.emit('data', {
						topic: 'bower/install/end'
						, error: ''
						, msg: '该 UI 组件：'+ name +' 已存在！'
						, info: {
							name: name
						}
					});

					rs = Promise.reject( new BowerError(name + ', 该 UI 组件已存在！') );
				}
				else{
					rs = Bower.install(name, function(type, info){  // 记录
						var data = {
							info: {}
						};

						if( type === 'info' ){
							data.info = info;
							data.topic = 'bower/info';
						}
						else if( type === 'conflict' ){
							index = +new Date();

							data.topic = 'bower/install/prompts';
							data.info.pick = info;
							data.info.cbId = index;
						}

						socket.emit('data', data);
					}, function(prompts, callback){
						// todo 分支选择

						PROMPT_CALLBACK_CACHE.push( callback );
						PROMPT_CALLBACK_INDEX[index] = PROMPT_CALLBACK_CACHE.length -1;

						console.log( PROMPT_CALLBACK_INDEX, typeof PROMPT_CALLBACK_CACHE[0] );
					}).then(function(info){
						var l = info.length
							, rs
							;

						if( l === 1 ){
							// db 保存
							send.info = info[0];

							Model.addBower(info[0]).then(function(rs){

								send.info.id = rs.insertId;

								socket.emit('data', send);
							});
						}
						else{
							console.log('安装多个组件');

							// 安装了多个组件，包哪个由用户选择
							socket.emit('data', {
								topic: 'bower/install/endChoose'
								, data: info
							});
						}
					}).catch(function(err){
						console.log(err);
					});
				}

				return rs;
			});
		}
	}
	, 'bower/install/endChoose': function(socket, data){
		var query = data.query || {}
			, save = query.choose
			, send = {
				topic: 'bower/install/end'
			}
			;

		Promise.all( save.map(function(d){
			return Model.addBower(d).then(function(rs){
				d.id = rs.insertId;

				return d;
			});
		}) ).then(function(info){
			send.info = info;

			socket.emit('data', send)
		});
	}
	, 'bower/install/prompts': function(socket, data){
		var query = data.query || {}
			, cbId = query.cbId
			, pickId = query.pickId
			, t = PROMPT_CALLBACK_CACHE[PROMPT_CALLBACK_INDEX[cbId]]
			;

		console.log('query', query);
		console.log('bower/install/prompts: ', pickId);
		if( t ){
			t({prompt: pickId});
		}
		else{
			socket.emit('data', {
				topic: 'bower/info'
				, error: ''
				, msg: '操作超时'
				, info: {}
			});
		}
	}
});