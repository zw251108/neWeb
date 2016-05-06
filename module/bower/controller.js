'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')
	, BowerError    = require('./error.js')

	, Bower = require('./bower.js')

	, PROMPT_CALLBACK_CACHE = []
	, PROMPT_CALLBACK_INDEX = {}
	;

// 注册首页 metro 模块
modules.register({
	id: 'bower'
	, metroSize: 'tiny'
	, title: '组件 bower'
	, icon: 'bower'
	, href: 'bower/'
});

menu.register({
	id: 'bower'
	, title: '组件 bower'
	, icon: 'bower'
	, href: 'bower/'
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
	}).then( View.bowerList )
		//.catch(function(){console.log(arguments)})
		.then(function(html){
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
			, execute
			;

		if( name ){
			execute = Bower.search( name).then(function(rs){
				send.data = rs;

				return send;
			});
		}
		else{
			execute = Promise.reject( new BowerError('缺少参数') );
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
	, 'bower/install': function(socket, data){
		var send = {
				topic: 'bower/install/end'
			}
			, query = data.query || {}
			, name = query.name
			, index
			, execute
			;

		if( name ){
			execute = Model.isExistBower( name ).then(function(isExist){
				var result
					;

				if( isExist ){
					result = Promise.reject( new BowerError(name + ' 该 UI 组件已存在！') );
				}
				else{
					result = Bower.install(name, function(type, info){  // 安装信息输出
						var data = {
							info: {}
						};

						if( type === 'info' ){  // 安装进度信息
							data.info = info;
							data.topic = 'bower/info';
						}
						else if( type === 'conflict' ){ // 安装 依赖 选择项
							index = +new Date();

							data.topic = 'bower/install/prompts';
							data.info.pick = info;
							data.info.cbId = index;
						}

						// 发送安装信息
						socket.emit('data', data);
					}, function(prompts, callback){ // 依赖 分支选择 回调函数记录
                        PROMPT_CALLBACK_CACHE.push( callback );
						PROMPT_CALLBACK_INDEX[index] = PROMPT_CALLBACK_CACHE.length -1;

						console.log( PROMPT_CALLBACK_INDEX, typeof PROMPT_CALLBACK_CACHE[0] );
					}).then(function(info){
						var l = info.length
							, result
							;

						if( l === 1 ){  // 独立组件
							send.info = info[0];

							// 保存 组件 数据
							result = Model.addBower(info[0]).then(function(rs){
								send.info.id = rs.insertId;

								return send;
							});
						}
						else{
							console.log('安装多个组件');

							// 安装了多个组件，包哪个由用户选择
							result = {
								topic: 'bower/install/endChoose'
								, data: info
							};
						}

						return result
					});
						//.catch(function(err){console.log(err);});
				}

				return result;
			});
		}
		else{
			execute = Promise.reject( new Bower('缺少参数') );
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