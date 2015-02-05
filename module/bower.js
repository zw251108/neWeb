'use strict';

var Bower = {
	    index: {
		    sql: 'select * from ui_lib'
	    }
	}

	, tpl           = require('./tpl.js').tpl
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template
	, header        = tpl('header')
	, footer        = tpl('footer')
	, moduleTpl     = emmetTpl({
		template: 'div.Container>section#%moduleId%.module.module-main.module-%moduleId%.large>div.module_content{%moduleContent%}'
	})
	, stylesheetTpl = emmetTpl({
		template: 'link[rel=stylesheet href=%path%]'
	})
	, styleTpl      = emmetTpl({
		template: 'style{%style%}'
	})
	, scriptTpl     = emmetTpl({
		template: 'script[data-main=%main% src=%require%]'
	})

	, bowerTpl      = emmetTpl({
		template: 'tr>td{%name%}+td{%version%}+td{%css_path%}+td{%js_path%}+td>a[href=%demo_path% target=_blank]{%demo_path%}^td{%tags_html%}+td{%receipt_time%}'
	})
	, bower         = require('bower')
	, pickerCallback
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

module.exports = function(web, db, socket){

	web.get('/bower/', function(req, res){
		var index = Bower.index;
		db.query(index.sql, function(e, data){console.log(data);
			if( !e ){
				res.send(header.replace('%pageTitle%', 'Bower 组件管理').replace('%style%', '') +
				moduleTpl({
					moduleId: 'bower'
					, moduleContent: '<div class="wrap"><table class="lib_table"><thead><tr>' +
					'<th>组件名称</th>' +
					'<th>版本</th>' +
					'<th>CSS 文件路径</th>' +
					'<th>JS 文件路径</th>' +
					'<th>demo 页面</th>' +
					'<th>标签</th>' +
					'<th>收录时间</th>' +
					'</tr></thead><tbody>'+ bowerTpl(data).join('') +'</tbody></table></div>'
				}).join('') +
				scriptTpl({
					main: '../script/bower'
					, require: '../script/lib/require.min.js'
				}).join('') +
				footer);
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
			bower.commands.search(data.query.name, {}).on('end', function (results) {
				socket.emit('getData', {
					topic: 'bower/search'
					, data: results
				});
				console.log(results);
			});
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
			}).on('end', function(installed){console.log(installed)
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