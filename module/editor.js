'use strict';

var Editor = {
		index: {
			sql: 'select editor.Id,editor.name,preview,tags_id,tags_name,width,height from editor,image' +
					' where tags_id like \'%48%\' and editor.preview=image.src order by editor.Id'
		}
		, code: {
			sql: 'select Id,name,tags_id,tags_name,include_file,html,css,js from editor where Id=?'
			, handler: function(data){
				data = data[0];
				data.html = data.html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				return data;
			}
		}
	}

	, tpl           = require('./tpl.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, codeTpl       = emmetTpl({
		template: 'a[href=code?id=%Id%]' +
				'>article.article.editor_article[data-tagsid=%tagsId%]' +
				'>h3.article_title{%name%}' +
				'+img.article_preview[src=%preview% width=%width% height=%height% alt=%alt%]',
		filter:{
			alt:function(data, index){
				return data.preview ? data.name : '没有预览图片';
			}
		}
	})
	, codeEditTpl   = emmetTpl({
		template: 'h3.editor_title{%name%}>input#id[type=hidden name=id value=%Id%]' +
				'^div#editorContainer.editor_container' +
				'>div.editor_area>label[for=html]{HTML}+textarea#html.hidden.code-html[name=html]{%html%}' +
				'^div.editor_area>label[for=css]{CSS}+textarea#css.hidden.code-css[name=css]{%css%}' +
				'^div.editor_area>label[for=js]{JavaScript}+textarea#js.hidden.code-js[name=js]{%js%}' +
				'^div.editor_area>label{Result}+iframe#result.editor_text[src=result?id=%Id% name=result]'
	})
	//, result        = tpl('editor/result')
	;

module.exports = function(web, db, socket, metro){
	var editor = Editor;

	metro.push({
		id: 'editor'
		, type: 'metro'
		, size: 'normal'
		, title: '前端编辑器 editor'
	});

	web.get('/editor/', function(req, res){
		var index = editor.index;

		db.query(index.sql, function(e, rs){
			if( !e ){
				res.send(tpl.html('module', {
					title: '前端编辑器 Editor'
					, modules: tpl.moduleTpl({
						id: 'editor'
						, type: 'main'
						, size: 'large'
						, title: '前端编辑器 editor'
						, content: codeTpl(rs).join('')
					}).join('')
					, script: {
						main: '../script/module/editor/index'
						, src: '../script/lib/require.min.js'
					}
				}) );
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
			db.query(code.sql, [id], function(e, rs){
				if( !e ){
					rs = code.handler( rs );

					res.send(tpl.html('module', {
						title: '前端编辑器 Editor'
						, stylesheet: [{
							path: '../script/plugin/codeMirror/lib/codemirror.css'
						}, {
							path: '../script/plugin/codeMirror/addon/fold/foldgutter.css'
						}]
						, modules: tpl.moduleTpl({
							id: 'editor'
							, type: 'main'
							, size: 'large'
							, title: '前端编辑器 editor'
							, content: codeEditTpl(rs).join('')
						}).join('')
						, script: {
							main: '../script/module/editor/code'
							, src: '../script/lib/require.min.js'
						}
					}) );
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
			, linkArr
			, scriptArr
			, temp
			;

		if( id ){
			db.query(code.sql, [id], function(e, data){
				if( !e ){
					//data = code.handler( data );
					data = data[0];

					temp = data.include_file.split(',');
					linkArr = temp.filter(function(d){
						return /\.css$/.test( d );
					}).map(function(d){
						return {path: d};
					});
					scriptArr = temp.filter(function(d){
						return /\.js$/.test( d );
					}).map(function(d){
						return {src: d};
					});

					res.send(tpl.html('editor/result', {
						title: '运行结果'
						, stylesheet:   linkArr
						, style:        {style:data.css}
						, modules:      data.html
						, script:       scriptArr
						, scriptCode:   {script:data.js}
					})
						//result
						//	.replace('%style%',
						//		(linkArr.length ? '<link rel="stylesheet" href="' + linkArr.join('"/><link rel="stylesheet" href="') + '"/>' : '') +
						//		'<style>' + data.css + '</style>')
						//	.replace('%html%', data.html)
						//	.replace('%script%',
						//		(scriptArr.length ? '<script src="' + scriptArr.join('"></script><script src="')+ '"></script>' : '') +
						//		'<script>' + data.js + '</script>')
					);
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