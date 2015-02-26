'use strict';

var Editor = {
		index: {
			sql: 'select editor.Id,editor.name,preview,tags_id,tags_name,width,height from editor,image' +
					' where status=1 and editor.preview=image.src order by editor.Id'
		}
		, code: {
			sql: 'select Id,name,tags_id,tags_name,css_lib,js_lib,html,css,js from editor where Id=?'
			, handler: function(data){
				data = data[0];
				data.html = data.html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
				return data;
			}
		}
		, edit: {
			sql: 'update editor set html=?,css=?,js=?,css_lib=?,js_lib=? where Id=?'
		}
		, save: {
			sql: 'insert into editor(status,html,css,js,css_lib,js_lib) values(1,?,?,?,?,?)'
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
		template: 'h3.editor_title{%name%}' +
				'+form#editorForm.editor_form[action=result method=post target=result]' +
				'>input#id[type=hidden name=id value=%Id%]' +
				'+input#cssLib[type=hidden name=css_lib value=%css_lib%]' +
				'+input#jsLib[type=hidden name=js_lib value=%js_lib%]' +
				'+div.editor_area.editor_area-html>label.hidden[for=html]{HTML}+textarea#html.hidden[name=html placeholder=body之间的HTML代码]{%html%}' +
				'^div.editor_area.editor_area-css>label.hidden[for=css]{CSS}+textarea#css.hidden[name=css placeholder=CSS代码]{%css%}' +
				'^div.editor_area.editor_area-js>label.hidden[for=js]{JavaScript}+textarea#js.hidden[name=js placeholder=JavaScript代码]{%js%}' +
				'^div.editor_area.editor_area-rs>label.hidden{Result}+iframe#result.editor_rs[name=result]'
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
					, modules: tpl.mainTpl({
						id: 'editor'
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
						, modules: tpl.mainTpl([{
							id: 'editor'
							, size: 'large'
							, title: '前端编辑器 editor'
							, toolbar: tpl.toolbarTpl([{
								id: 'changeSkin'
								, icon: 'skin'
								, title: '更改皮肤'
							}, {
								id: 'changeLayout'
								, icon: 'layout'
								, title: '更改布局'
							}, {
								id: 'lib'
								, icon: 'lib'
								, title: '引用组件'
							}, {
								id: 'newWin'
								, icon: 'window'
								, title: '在新窗口浏览'
							}, {
								id: 'run'
								, icon: 'play'
								, title: '运行'
							}, {
								id: 'save'
								, icon: 'save'
								, title: '保存'
							}]).join('')
							, content: codeEditTpl(rs).join('')
						}]).join('') + tpl.popupTpl({
							id: 'lib_bower'
							, type: 'popup'
						})
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
	//web.get('/editor/result', function(req, res){
	//	var code = editor.code
	//		, id = req.query.id || ''
	//		, css_lib
	//		, js_lib
	//		, temp
	//		;
	//
	//	if( id ){
	//		db.query(code.sql, [id], function(e, data){
	//			if( !e ){
	//				//data = code.handler( data );
	//				data = data[0];
	//
	//				css_lib = (data.css_lib || '').split(',').map(function(d){
	//					return {path: d};
	//				});
	//				js_lib = (data.js_lib || '').split(',').map(function(d){
	//					return {src: d};
	//				});
	//
	//				res.send(tpl.html('editor/result', {
	//					title: '运行结果'
	//					, stylesheet:   css_lib
	//					, style:        {style:data.css}
	//					, modules:      data.html
	//					, script:       js_lib
	//					, scriptCode:   {script:data.js}
	//				}) );
	//			}
	//			else{
	//				console.log('\n', 'db', '\n', code.sql, '\n', e.message);
	//			}
	//			res.end();
	//		});
	//	}
	//	else{
	//		res.end();
	//	}
	//});
	//
	//// 编辑器 提交运行代码
	//web.post('/editor/result', function(req, res){
	//	var query   = req.body
	//		, html  = query.html
	//		, css   = query.css
	//		, js    = query.js
	//		, css_lib   = (query.css_lib || '').split(',').map(function(d){
	//			return {path: d};
	//		})
	//		, js_lib = (query.js_lib || '').split(',').map(function(d){
	//			return {src: d};
	//		})
	//		;
	//
	//	res.send(tpl.html('editor/result', {
	//		title: '运行结果'
	//		, stylesheet:   css_lib
	//		, style:        {style:css}
	//		, modules:      html
	//		, script:       js_lib
	//		, scriptCode:   {script:js}
	//	}) );
	//});

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
		, 'editor/save': function(socket, data){
			var arr = []
				, query = data.query
				, id = query.id || ''
				, sql
				;

			arr.push.call(arr, query.html, query.css, query.js, query.cssLib, query.jsLib);

			if( id ){
				sql = editor.edit;
				arr.push( id );
			}
			else{
				sql = editor.save;
			}
			db.query(sql.sql, arr, function(e){
				if( !e ){
					socket.emit('getData', {
						topic: 'editor/save'
						, msg: 'success'
					});
				}
				else{
					console.log('\n', 'db', '\n', sql.sql, '\n', e.message);
				}
			});
		}
	});
};