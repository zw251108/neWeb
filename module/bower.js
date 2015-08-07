'use strict';

var db          = require('./db.js')
	, web       = require('./web.js')
	, socket    = require('./socket.js')
	, error     = require('./error.js')

	, metro     = require('./metro.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, bowerTpl  = emmetTpl({
		template: 'tr>td{%name%}+td{%version%}+td{%css_path%}+td{%js_path%}+td>a[href=%demo_path% target=_blank]{%demo_path%}^td{%source%}+td{%homepage%}+td{%tags_html%}+td{%receipt_time%}'
		, filter: {
			css_path: function(d){
				return d.css_path ? d.css_path.split(',').map(function(d){
					return '<p>'+ d +'</p>';
				}).join('') : '';
			}
			, js_path: function(d){
				return d.js_path ? d.js_path.split(',').map(function(d){
					return '<p>'+ d +'</p>';
				}).join('') : '';
			}
		}
	})
	, pickerCallback

	, bower     = require('bower')

	, Promise = require('promise')

	, bowerMethods = {
		search: function(name, socket){
			bower.commands.search(name, {}).on('end', function (results) {
				socket.emit('data', {
					topic: 'bower/search'
					, data: results
				});
			});
		}
		, install: function(name, socket, db){
			bower.commands.install([name], {save: true}, {interactive: true}).on('log', function(msg){
				var data = {}
					;
				if( msg.level !== 'conflict' ){
					data.topic = 'bower/info';
					data.msg = {
						level: msg.level
						, id: msg.id
						, message: msg.message
					};
				}
				else{
					data.topic = 'bower/install/prompts';
					data.info = msg.data.picks.map(function(d, i){
						var dependants = d.dependants;
						d = d.endpoint;
						return {
							name: d.name
							, version: d.target
							, required: dependants.map(function(d, i){
								var t = d.endpoint;
								console.log({
									name: t.name
									, version: t.target
								});
								return {
									name: t.name
									, version: t.target
								};
							})
						};
					});
				}

				socket.emit('data', data);
			}).on('prompt', function(prompts, callback) {

				//socket.emit('data', {
				//	topic: 'bower/install/prompts'
				//	, msg: prompts
				//});

				//pickerCallback = callback;

				console.log(prompts);
			}).on('error', function(e){

				socket.emit('data', {
					error: ''
					, msg: ''
				});
				console.log(e);
			}).on('end', function(installed){
				var k
					, t
					, info = []
					, js = ''
					, css = ''
					, temp
					;
				for( k in installed ) if( installed.hasOwnProperty(k) ){
					//t = installed[k].endpoint;
					t = installed[k].pkgMeta;

					info.push({
						name: t.name
						, version: '~'+ t.target
					});

					temp = t.main;
					if( typeof temp === 'string' ){
						if( /\.js$/.test(temp) ){
							js = temp;
						}
						else if( /\.css$/.test(temp) ){
							css = temp;
						}
					}
					else if( Array.isArray(temp) ){
						js = temp.filter(function(d){
							return /\.js$/.test(d);
						}).join(',');
						css = temp.filter(function(d){
							return /\.css$/.test(d);
						}).join('');
					}

					db.query(Bower.save.sql, [t.name, '~'+ t.version, css, js, t._source, t.homepage], function(e){

					});
				}

				socket.emit('data', {
					topic: 'bower/install/end'
					, info: info
				});

				console.log(installed);
			});
		}
	}

	/**
	 * @namespace   Bower
	 * */
	, Bower = {
		/**
		 * @method
		 * */
		search: function(name){
			return new Promise(function(resolve, reject){
				bower.commands.search(name, {}).on('end', function (results) {

					resolve( results );
				});
			});
		}
		, install: function(name, log, prompts){
			return new Promise(function(resolve, reject){
				bower.commands.install([name], {save: true}, {interactive: true}).on('log', function(msg){  // 记录
					var info = {}
						, type = ''
						;

					if( msg.level !== 'conflict' ){
						type = 'info';

						info = {
							level: msg.level
							, id: msg.id
							, message: msg.message
						};
					}
					else{
						type = 'conflict';

						info = msg.data.picks.map(function(d, i){
							var dependants = d.dependants;

							d = d.endpoint;

							return {
								name: d.name
								, version: d.target
								, required: dependants.map(function(d, i){
									var t = d.endpoint;
									console.log({
										name: t.name
										, version: t.target
									});
									return {
										name: t.name
										, version: t.target
									};
								})
							};
						});
					}

					log(type, info);
				}).on('prompt', function(prompts, callback){
					// todo 分支选择
				}).on('error', function(e){
					reject( e );
				}).on('end', function(installed){
					var info = []
						, obj, temp, k, t
						, name
						;

					for( k in installed ) if( installed.hasOwnProperty(k) ){

						t = installed[k].pkgMeta;
						name = t.name;

						obj = {
							name: name
							, version: '~'+ t.version
							, source: t._source
							, homepage: t.homepage
							, tags: ''
							, css_path: ''
							, js_path: ''
						};

						temp = t.main;
						console.log(temp)
						if( typeof temp === 'string' ){
							if( /\.js$/.test(temp) ){
								obj.js_path = name +'/'+ temp;
							}
							else if( /\.css$/.test(temp) ){
								obj.css_path = name +'/'+ temp;
							}
						}
						else if( Array.isArray(temp) ){
							obj.js_path = temp.filter(function(d){
								return /\.js$/.test(d);
							});
							obj.js_path = obj.js_path.length ? name +'/'+ obj.js_path.join(','+ name +'/') : '';

							obj.css_path = temp.filter(function(d){
								return /\.css$/.test(d);
							});
							obj.css_path = obj.css_path.length ? name +'/'+ obj.css_path.join(','+ name +'/') : '';
						}

						info.push(obj);
					}

					console.log(installed);
					resolve( info );
				});
			});
		}
		/**
		 * @namespace   Model
		 * @memberof    Bower
		 * @desc    业务相关 sql 语句集合
		 * */
		, Model: {
			bower: 'select * from ui_lib'
			, bowerPage: 'select * from ui_lib limit :page,:size'
			, save: 'insert into ui_lib(name,version,css_path,js_path,source,homepage,tags,receipt_time) values(:name,:version,:css_path,:js_path,:source,:homepage,:tags,now())'
		}

		/**
		 * @namespace   Handler
		 * @memberof    Bower
		 * @desc    数据处理方法集合
		 * */
		, Handler: {}

		/**
		 * @namespace   View
		 * @memberof    Bower
		 * @desc    视图模板集合
		 * */
		, View: {
			bower: function(rs){
				//rs = rs.result;

				return tpl.html('module', {
					title: '前端组件管理 Bower'
					, modules: tpl.mainTpl({
						id: 'bower', size: 'large', title: '前端组件管理 bower'
						, toolbar: tpl.toolbarTpl([{
							id: 'switch_dialog', icon: 'search', title: '搜索组件'
						}]).join('')
						, content: '<div class="wrap">' +
								'<table class="lib_table">' +
									'<thead>' +
										'<tr>' +
											'<th>组件名称</th>' +
											'<th>版本</th>' +
											'<th>CSS 文件路径</th>' +
											'<th>JS 文件路径</th>' +
											'<th>demo 页面</th>' +
											'<th>组件来源</th>' +
											'<th>组件主页</th>' +
											'<th>标签</th>' +
											'<th>收录时间</th>' +
										'</tr>' +
									'</thead>' +
									'<tbody>'+ bowerTpl(rs).join('') +'</tbody>' +
								'</table>' +
							'</div>'
					}).join('') + tpl.popupTpl([{
						id: 'result', type: 'popup', size: 'large'
							, content: '<form action="#" id="bowerSearch">' +
									'<div class="formGroup">' +
										'<input class="input" type="text"/>' +
										'<button class="btn icon icon-search" type="submit" value=""></button>' +
									'</div>' +
								'</form>' +
								'<div class="bower_resultList">' +
									'<table><thead><tr><th></th><th>组件名称</th><th>组件来源</th></tr></thead><tbody></tbody></table>' +
								'</div>'}, {
						id: 'info', type: 'popup', size: 'big'
							, content: '<ul id="infoList"></ul>'
					}]).join('')
					, script: {
						main: '../script/bower'
						, src: '../script/lib/require.min.js'
					}
				});
			}
		}

		, index: {
			sql: 'select * from ui_lib'
		}
		, save: {
			sql: 'insert into ui_lib(name,version,css_path,js_path,source,homepage,receipt_time) values(?,?,?,?,?,now())'
		}
	}

//, inquirer =  require('inquirer')
	;

//bower.commands.install(['ember-data'], {save: true}, {interactive: true})
//	.on('data', function(msg){
//		console.log('data\n', msg);
//	}).on('log', function(msg){
//		console.log('['+ msg.level+']', msg.id, msg.message);
//		if( msg.level === 'conflict' ){
//			console.dir(msg);
//			msg.data.picks.forEach(function(d, i){
//				console.log('pick');
//				console.dir(d);
//
//				var temp = d.endpoint;
//				console.log( (i+1) + ') ' + temp.name + ' version: ' + temp.target );
//
//				temp = d.dependants;
//				console.log(temp);
//				//temp = temp[0].dependencies
//				//console.log(temp);
//			});
//
//			console.log(
//				msg.data.picks.map(function(d, i){
//					var endpoint = d.endpoint
//						, dependants = d.dependants
//						;
//					d = d.endpoint;
//					return {
//						name: d.name
//						, version: d.target
//						, required: dependants.map(function(d, i){
//							var t = d.endpoint;
//							return {
//								name: t.name
//								, version: t.target
//							};
//						})
//					};
//				//return (i+1) + ') ' + temp.name + ' version: ' + temp.target;
//			}).join('\n')
//			);
//		}
//	}).on('prompt', function(prompts, callback) {
//		console.log('prompt\n', prompts);
//		//callback({prompt: '2'});
//		inquirer.prompt(prompts, callback);
//	}).on('error', function(e){
//		console.log(e);
//	}).on('end', function(installed){
//		//var name = installed
//		console.dir(installed);
//	});

// 注册首页 metro 模块
metro.push({
	id: 'bower'
	, type: 'metro'
	, size: 'normal'
	, title: '前端组件管理 bower'
});

web.get('/bower/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	page = page < 1 ? 1 : page;
	size = size < 1 ? 20 : size;

	db.handle({
		sql: Bower.Model.bowerPage
		, data: {
			page: (page-1) * size
			, size: size
		}
	}).then( Bower.View.bower ).then(function(html){
		res.send( html );
		res.end();
	});
});

/**
 * 数据接口
 * */
web.get('/data/bower', function(req, res){
	var query = req.query || {}
		, page
		, size
		, callback = query.callback
		, handle = {}
		;

	if( 'page' in query ){
		page = query.page || 1;
		size = query.size || 20;

		page = page < 1 ? 1 : page;
		size = size < 1 ? 20 : size;

		handle.sql = Bower.Model.bowerPage;
		handle.data = {
			page: (page-1) * size
			, size: size
		}
	}
	else{
		handle.sql = Bower.Model.bower;
	}

	db.handle( handle ).then(function(rs){
		rs = JSON.stringify( rs );//.result );

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});

socket.register({
	bower: function(socket, data){
		var query = data.query || {}
			, page
			, size
			, handle = {}
			;

		if( 'page' in query ){
			page = query.page || 1;
			size = query.size || 20;

			page = page < 1 ? 1 : page;
			size = size < 1 ? 20 : size;

			handle.sql = Bower.Model.bowerPage;
			handle.data = {
				page: (page-1) * size
				, size: size
			};
		}
		else{
			handle.sql = Bower.Model.bower;
		}

		db.handle( handle ).then(function(rs){
			//rs = rs.result;

			socket.emit('data', {
				topic: 'bower'
				, data: rs
			})
		});
	}
	, 'bower/editor/lib': function(socket, data){

	}
	, 'bower/search': function(socket, data){
		var send = {
				topic: 'bower/search'
			}
			, query = data.query || {}
			, name = query.name
			;

		if( name ){
			Bower.search( name ).then(function(rs){

				send.data = rs;

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少产生';

			socket.emit('data', send);
		}
	}
	, 'bower/install': function(socket, data){
		var send = {
				topic: 'bower/install/end'
			}
			, query = data.query || {}
			, name = query.name
			;
		if( name ){
			Bower.install(name, function(type, info){  // 记录
				var data = {};

				data.info = info;

				if( type === 'info' ){
					data.topic = 'bower/info';
				}
				else if( type === 'conflict' ){
					data.topic = 'bower/install/prompts';
				}

				socket.emit('data', data);
			}, function(prompts, callback){
				// todo 分支选择
			}).then(function(info){

				// db 保存
				send.info = info[0];

				if( info.length > 1 ){
					console.log('安装多个组件')
				}

				return db.handle({
					sql: Bower.Model.save
					, data: info[0]
				});
			}).then(function(rs){

				if( send.info ){
					send.info.id = rs.insertId;
				}
				else{
					send.info = {
						id: rs.insertId
					};
				}

				socket.emit('data', send);
			});
		}
	}
	, 'bower/install/prompt': function(socket, data){

	}
});

module.exports = Bower;
//	= function(web, db, socket, metro){
//
//	web.get('/bower/', function(req, res){
//		var index = Bower.index;
//		db.query(index.sql, function(e, rs){
//			if( !e ){
//				res.send(tpl.html('module', {
//					title: '前端组件管理 Bower'
//					, modules: tpl.mainTpl({
//						id: 'bower', size: 'large', title: '前端组件管理 bower'
//						, toolbar: tpl.toolbarTpl([{
//							id: 'switch_dialog', icon: 'search', title: '搜索组件'
//						}]).join('')
//						, content: '<div class="wrap"><table class="lib_table">' +
//									'<thead>' +
//										'<tr>' +
//											'<th>组件名称</th>' +
//											'<th>版本</th>' +
//											'<th>CSS 文件路径</th>' +
//											'<th>JS 文件路径</th>' +
//											'<th>demo 页面</th>' +
//											'<th>组件来源</th>' +
//											'<th>组件主页</th>' +
//											'<th>标签</th>' +
//											'<th>收录时间</th>' +
//										'</tr>' +
//									'</thead>' +
//									'<tbody>'+ bowerTpl(rs).join('') +'</tbody>' +
//								'</table>' +
//							'</div>'
//					}).join('') + tpl.popupTpl([{
//						id: 'result', type: 'popup', size: 'big'
//							, content: '<form action="#" id="bowerSearch">' +
//								'<input class="input" type="text"/>' +
//								'<button class="btn icon icon-search" type="submit" value=""></button>' +
//							'</form>' +
//							'<div class="bower_resultList">' +
//								'<table><thead><tr><th></th><th>组件名称</th><th>组件来源</th></tr></thead><tbody></tbody></table>' +
//							'</div>'}, {
//						id: 'info', type: 'popup', size: 'big'
//					}]).join('')
//					, script: {
//						main: '../script/bower'
//						, src: '../script/lib/require.min.js'
//					}
//				}) );
//			}
//			else{
//				console.log('\n', 'db', '\n', index.sql, '\n', e.message);
//			}
//			res.end();
//		});
//	});
//
//	socket.register({
//		bower: function(socket, query){
//
//		}
//		, 'bower/editor/lib': function(socket){
//			db.query(Bower.index.sql, function(e, rs){
//				if( !e ){
//					socket.emit('data', {
//						topic: 'editor/lib'
//						, data: rs
//					});
//				}
//				else{
//					socket.emit('data', {
//						error: ''
//						, msg: ''
//					});
//					console.log('\n', 'db', '\n', Bower.index.sql, '\n', e.message);
//				}
//			})
//		}
//		, 'bower/search': function(socket, data){
//			bowerMethods.search(data.query.name, socket);
//		}
//		, 'bower/install': function(socket, data){
//			bower.commands.install([data.query.name], {save: true}, {interactive: true}).on('log', function(msg){
//				var data = {}
//					;
//				if( msg.level !== 'conflict' ){
//					data.topic = 'bower/info';
//					data.msg = {
//						level: msg.level
//						, id: msg.id
//						, message: msg.message
//					};
//				}
//				else{
//					data.topic = 'bower/install/prompts';
//					data.info = msg.data.picks.map(function(d, i){
//						var dependants = d.dependants;
//						d = d.endpoint;
//						return {
//							name: d.name
//							, version: d.target
//							, required: dependants.map(function(d, i){
//								var t = d.endpoint;
//								console.log({
//									name: t.name
//									, version: t.target
//								});
//								return {
//									name: t.name
//									, version: t.target
//								};
//							})
//						};
//					});
//				}
//
//				socket.emit('data', data);
//				console.dir(data);
//			}).on('prompt', function(prompts, callback) {
//
//				//socket.emit('data', {
//				//	topic: 'bower/install/prompts'
//				//	, msg: prompts
//				//});
//
//				//pickerCallback = callback;
//
//				console.log(prompts);
//			}).on('error', function(e){
//
//				socket.emit('data', {
//					error: ''
//					, msg: ''
//				});
//				console.log(e);
//			}).on('end', function(installed){
//				var k
//					, t
//					, info = []
//					;
//				for( k in installed ) if( installed.hasOwnProperty( k ) ){
//					t = installed[k].endpoint;
//
//					info.push({
//						name: t.name
//						, version: t.target
//					});
//				}
//
//				socket.emit('data', {
//					topic: 'bower/install/end'
//					, info: info
//				});
//				console.log(installed);
//			});
//		}
//		, 'bower/install/prompt': function(socket, data){
//			var answer = data.query.answer;
//		}
//	});
//};