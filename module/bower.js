'use strict';

var db          = require('./db.js')
	, web       = require('./web.js')
	, socket    = require('./socket.js')
	, error     = require('./error.js')

	, index     = require('./index.js')

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

	, bower     = require('bower')

	, Promise   = require('promise')

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
		, install: function(name, log, promptCB){
			return new Promise(function(resolve, reject){
				bower.commands.install([name], {save: true, forceLatest: true}, {interactive: true}).on('log', function(msg){  // 记录
					var info = {}
						, type = ''
						;
					console.log('msg');
					console.log(msg);
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
						console.log('msg.data.picks')
						console.log(msg.data.picks)
						info = msg.data.picks.map(function(d, i){
							console.log('msg.data.picks', i)
							console.log(d)
							var dependants = d.dependants;
							console.log('dependants')
							console.log( dependants);
							d = d.endpoint;
							console.log('endpoint')
							console.log(d);
							return {
								name: d.name
								, version: d.target
								, required: dependants.map(function(d, i){
									var t = d.endpoint;
									console.log(t);
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

					promptCB(prompts, callback);
				}).on('error', function(e){
					reject( e );
				}).on('end', function(installed){
					var info = []
						, obj, temp, k, t
						, name
						;

					for( k in installed ) if( installed.hasOwnProperty(k) ){

						t = installed[k].pkgMeta;
						name = k;

						obj = {
							name: name
							, version: '~'+ (t.version || '1.0.0')
							, source: t._source
							, homepage: t.homepage
							, tags: ''
							, css_path: ''
							, js_path: ''
						};

						temp = t.main;

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
			, bowerIsExist: 'select * from ui_lib where name like :name'
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
						id: 'info', type: 'popup', size: 'large'
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

	, PROMPT_CALLBACK_CACHE = []
	, PROMPT_CALLBACK_INDEX = {}

	;

// 注册首页 metro 模块
index.push({
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
			, index
			;

		if( name ){
			db.handle({
				sql: Bower.Model.bowerIsExist
				, data: {
					name: name
				}
			}).then(function(rs){
				return !!(rs && rs.length);
			}).then(function(isExist){

				if( isExist ){
					socket.emit('data', {
						topic: 'bower/install/end'
						, error: ''
						, msg: '该 UI 组件：'+ name +' 已存在！'
						, info: {
							name: name
						}
					});

					throw new Error('该 UI 组件：'+ name +' 已存在！');
				}

				return Bower.install(name, function(type, info){  // 记录
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
				});
			}).then(function(info){
				var l = info.length
					, rs
					;

				if( l === 1 ){
					// db 保存
					send.info = info[0];

					db.handle({
						sql: Bower.Model.save
						, data: info[0]
					}).then(function(rs){

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
	}
	, 'bower/install/endChoose': function(socket, data){
		var query = data.query || {}
			, save = query.choose
			, send = {
				topic: 'bower/install/end'
			}
			;

		Promise.all( save.map(function(d){
			return db.handle({
				sql: Bower.Model.save
				, data: d
			}).then(function(rs){
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
		console.log('query', query)
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

module.exports = Bower;