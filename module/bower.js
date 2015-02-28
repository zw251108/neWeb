'use strict';

var Bower = {
	    index: {
		    sql: 'select * from ui_lib'
	    }
		, save: {
			sql: 'insert into ui_lib(name,version,css_path,js_path,source,homepage,receipt_time) values(?,?,?,?,?,now())'
		}
	}

	, bower         = require('bower')

	, tpl           = require('./tpl.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, bowerTpl      = emmetTpl({
		template: 'tr>td{%name%}+td{%version%}+td{%css_path%}+td{%js_path%}+td>a[href=%demo_path% target=_blank]{%demo_path%}^td{%source%}+td{%homepage%}+td{%tags_html%}+td{%receipt_time%}'
	})
	, pickerCallback
	, bowerMethods = {
		search: function(name, socket){
			bower.commands.search(name, {}).on('end', function (results) {
				socket.emit('getData', {
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

				socket.emit('getData', data);
			}).on('prompt', function(prompts, callback) {

				//socket.emit('getData', {
				//	topic: 'bower/install/prompts'
				//	, msg: prompts
				//});

				//pickerCallback = callback;

				console.log(prompts);
			}).on('error', function(e){

				socket.emit('getData', {
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

				socket.emit('getData', {
					topic: 'bower/install/end'
					, info: info
				});

				console.log(installed);
			});
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



module.exports = function(web, db, socket, metro){

	metro.push({
		id: 'bower'
		, type: 'metro'
		, size: 'normal'
		, title: '前端组件管理 bower'
	});

	web.get('/bower/', function(req, res){
		var index = Bower.index;
		db.query(index.sql, function(e, data){console.log(data);
			if( !e ){
				res.send(tpl.html('module', {
					title: '前端组件管理 Bower'
					, modules: tpl.mainTpl({
						id: 'bower'
						, size: 'large'
						, title: '前端组件管理 bower'
						, toolbar: tpl.toolbarTpl([{
							id: 'switch_dialog'
							, icon: 'search'
							, title: '搜索组件'
						}]).join('')
						, content: '<div class="wrap"><table class="lib_table">' +
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
									'<tbody>'+ bowerTpl(data).join('') +'</tbody>' +
								'</table>' +
							'</div>'
					}).join('')
					, script: {
						main: '../script/bower'
						, src: '../script/lib/require.min.js'
					}
				}) );
			}
			else{
				console.log('\n', 'db', '\n', index.sql, '\n', e.message);
			}
			res.end();
		}, function(){
			res.end();
		})
	});

	socket.register({
		bower: function(socket, query){

		}
		, 'bower/search': function(socket, data){
			bowerMethods.search(data.query.name, socket);
		}
		, 'bower/install': function(socket, data){
			bower.commands.install([data.query.name], {save: true}, {interactive: true}).on('log', function(msg){
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

				socket.emit('getData', data);
				console.dir(data);
			}).on('prompt', function(prompts, callback) {

				//socket.emit('getData', {
				//	topic: 'bower/install/prompts'
				//	, msg: prompts
				//});

				//pickerCallback = callback;

				console.log(prompts);
			}).on('error', function(e){

				socket.emit('getData', {
					error: ''
					, msg: ''
				});
				console.log(e);
			}).on('end', function(installed){
				var k
					, t
					, info = []
					;
				for( k in installed ) if( installed.hasOwnProperty( k ) ){
					t = installed[k].endpoint;

					info.push({
						name: t.name
						, version: t.target
					});
				}
				socket.emit('getData', {
					topic: 'bower/install/end'
					, info: info
				});
				console.log(installed);
			});
		}
		, 'bower/install/prompt': function(socket, data){
			var answer = data.query.answer;
		}
	});
};