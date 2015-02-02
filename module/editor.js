'use strict';

var Editor = {
		index: {
			sql: 'select editor.Id,editor.name,preview,tags_id,tags_name,width,height from editor,image where tags_id like \'%48%\' and editor.preview=image.src order by editor.Id'
		}
		, code: {
			sql: 'select Id,name,tags_id,tags_name,include_file,html,css,js from editor where Id=?'
			, handler: function(data){
				return data[0];
			}
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

	, result        = tpl('editor/result')
	;

module.exports = function(web, db, socket){
	var editor = Editor;

	web.get('/editor/', function(req, res){
		var index = editor.index;

		db.query(index.sql, function(e, data){
			if( !e ){
				res.send(header.replace('%pageTitle%', '前端编辑器 Editor')
					.replace('%style%', '') + moduleTpl([{
					moduleId: 'editor'
					, moduleContent: codeTpl(data).join('')
				}]).join('') + footer);
			}
			else{
				console.log('\n', 'db', '\n', index.sql, '\n', e.message);
			}
			res.end();
		});
	});
	web.get('/editor/code', function(req, res){
		var code = editor.code
			, id = req.query.id || ''
			;

		if( id ){
			db.query(code.sql, [id], function(e, data){
				if( !e ){
					data = code.handler( data );
					res.send(header.replace('%pageTitle%', '前端编辑器 Editor')
						.replace('%style%', stylesheetTpl({
							path: '../script/plugin/codeMirror/lib/codemirror.css'
						}).join('')) + moduleTpl([{
						moduleId: 'editor'
						, moduleContent: codeEditTpl(data).join('')
					}]).join('') + scriptTpl([{
						main: '../script/module/editor/code'
						, require: '../script/lib/require.min.js'
					}]).join('') + footer);
				}
				else{
					console.log('\n', 'db', '\n', code.sql, '\n', e.message);
				}
				res.end();
			});
		}
		else{
			res.end();
		}
	});
	web.get('/editor/result', function(req, res){
		var code = editor.code
			, id = req.query.id || ''
			;

		if( id ){
			db.query(code.sql, [id], function(e, data){console.log(data);
				if( !e ){
					data = code.handler( data );
					res.send(result.replace('%style%', data.css)
						.replace('%html%', data.html)
						.replace('%script%', data.js));
				}
				else{
					console.log('\n', 'db', '\n', code.sql, '\n', e.message);
				}
				res.end();
			});
		}
		else{
			res.end();
		}
	});

	socket.register({
		editor: function(socket){
			var index = editor.index;
			db.query(index.sql, function(e, rs){
				if( !e ){
					socket.emit('getData', {
						topic: 'editor'
						, data: rs
					});
				}
				else{
					socket.emit('getData', {
						error: ''
						, msg: ''
					});
					console.log('\n', 'db', '\n', index.sql, '\n', e.message);
				}
			});
		}
		, 'editor/code': function(socket, data){
			var id = data.query.id || ''
				, code = editor.code
				;
			if( id ){
				db.query(code.sql, [id], function(e, rs){
					if( !e ){
						rs = code.handler(rs);
						socket.emit('getData', {
							topic: 'editor/code'
							, info: rs
						});
					}
					else{
						socket.emit('getData', {
							error: ''
							, msg: ''
						});
						console.log('\n', 'db', '\n', code.sql, '\n', e.message);
					}
				});
			}
			else{
				socket.emit('getData', {
					error: ''
					, msg: ''
				});
				console.log('\n', 'socket editor/code', '\n', 'no id');
			}
		}
	});
};