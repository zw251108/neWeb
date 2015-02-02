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
//, inquirer =  require('inquirer')
	;

//bower.commands.on('log', function(msg){
//	console.log(msg)
//	//if( msg.level === 'conflict' ){
//	//	msg.data.picks.forEach(function(d, i){
//	//		console.dir(d)
//	//	});
//	//
//	//	console.log(msg.data.picks.map(function(d, i){
//	//		var temp = d.endpoint;
//	//		return (i+1) + ') ' + temp.name + ' version: ' + temp.target;
//	//	}).join('\n'));
//	//}
//}).on('prompt', function(prompts, callback) {
//	console.log(prompts)
//	//callback({prompt: '2'});
//	//inquirer.prompt(prompts, callback);
//}).on('error', function(e){
//	console.log(e);
//}).on('end', function(installed){
//	//var name = installed
//	console.dir(installed);
//});
//bower.commands.install(['ember-data'], {save: true}, {interactive: true});
//function install(names, log, prompt, error, end){
//	if( typeof names === 'string' ) names = [names];
//
//	bower.commands.install(['ember'], {save: true}, {}).on('log', function(msg){
//			console.log(msg);
//			//if( msg.level === 'conflict' ){
//			//	msg.data.picks.forEach(function(d, i){
//			//		console.dir(d)
//			//	});
//			//
//			//	console.log(msg.data.picks.map(function(d, i){
//			//		var temp = d.endpoint;
//			//		return (i+1) + ') ' + temp.name + ' version: ' + temp.target;
//			//	}).join('\n'));
//			//}
//		}).on('prompt', function(prompts, callback) {
//			console.log(prompts);
//			//callback({prompt: '2'});
//			//inquirer.prompt(prompts, callback);
//		}).on('error', function(e){
//			console.log(e);
//		}).on('end', function(installed){
//			var name = installed.
//				console.log(installed);
//		});
//}
//
//function search(name, end){
//	bower.commands.search(name, {}).on('end', function (results) {
//		end(results);
//		console.log(results);
//	});
//}

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
		, 'bower/search': function(socket, query){
			bower.commands.search(query.name, {}).on('end', function (results) {
				socket.emit('bower/search', results);
				console.log(results);
			});
		}
		, 'bower/install': function(socket, query){
			bower.commands.install(['ember'], {save: true}, {}).on('log', function(msg){
				console.log(msg);
				//if( msg.level === 'conflict' ){
				//	msg.data.picks.forEach(function(d, i){
				//		console.dir(d)
				//	});
				//
				//	console.log(msg.data.picks.map(function(d, i){
				//		var temp = d.endpoint;
				//		return (i+1) + ') ' + temp.name + ' version: ' + temp.target;
				//	}).join('\n'));
				//}
			}).on('prompt', function(prompts, callback) {
				console.log(prompts);
				//callback({prompt: '2'});
				//inquirer.prompt(prompts, callback);
			}).on('error', function(e){
				console.log(e);
			}).on('end', function(installed){
				//var name = installed
				console.dir(installed);
			});
		}
	});
};