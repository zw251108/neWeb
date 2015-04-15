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
			sql: 'update editor set name=?,html=?,css=?,js=?,css_lib=?,js_lib=? where Id=?'
		}
		, save: {
			sql: 'insert into editor(status,html,css,js,css_lib,js_lib,name,preview,create_time) values(1,?,?,?,?,?,?,\'../image/default/no-pic.png\',now())'
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
				'+div.editor_area.editor_area-html>textarea#html.hidden[name=html placeholder=body&nbsp;之间的&nbsp;HTML代码]{%html%}+label.hidden[for=html]{HTML}' +
				'^div.editor_area.editor_area-css>textarea#css.hidden[name=css placeholder=CSS&nbsp;代码]{%css%}+label.hidden[for=css]{CSS}' +
				'^div.editor_area.editor_area-js>textarea#js.hidden[name=js placeholder=JavaScript&nbsp;代码]{%js%}+label.hidden[for=js]{JavaScript}' +
				'^div.editor_area.editor_area-rs>label.hidden{Result}+iframe#result.editor_rs[name=result]'
	})
	//, result        = tpl('editor/result')
	, resCode = function(rs){
		return tpl.html('module', {
			title: '前端编辑器 Editor'
			, modules: tpl.mainTpl({
				id: 'editor'
				, title: '前端编辑器 editor'
				, toolbar: tpl.toolbarTpl([{
					id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'}, {
					id: 'changeLayout', icon: 'layout', title: '更改布局'}, {
					id: 'lib',          icon: 'lib',    title: '引用组件'}, {
					id: 'newWin',       icon: 'window', title: '在新窗口浏览'}, {
					id: 'run',          icon: 'play',   title: '运行'}, {
					id: 'save',         icon: 'save',   title: '保存'
				}]).join('')
				, content: codeEditTpl(rs).join('')
			}).join('') + tpl.popupTpl([{
				id: 'editorLib',    size: 'normal'
					, content: '<dl class="list-tree" id="libList"></dl>'
					, button: '<button type="button" id="" class="btn">确定</button>'}, {
				id: 'editorSave',   size: 'normal'
					, content: '<form><div class="formGroup">' +
						'<label for="codeName">请输入名称</label>' +
						'<input type="text" id="codeName" class="input" placeholder="请输入标题" value="%name%"  data-validator="title"/>' +
					//'</div>' +
					//'<div class="formGroup">' +
					//	'<label for="codeTags">请选择标签</label>' +
					//	'<div id="Tag">' +
					//		'<input type="text" id="" class="input"/>' +
					'</div></form>'
					, button: '<button type="button" id="codeSave" class="btn">保存</button>'}, {
				id: 'alert',    size: 'small', content: '<div class="msg" id="alertContent"></div>'
					, button: '<button type="button" id="" class="btn">确定</button>'
			}]).join('')
			, script: {
				main: '../script/module/editor/code'
				, src: '../script/lib/require.min.js'
			}
		});
	}
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
						, title: '前端编辑器 editor'
						, toolbar: tpl.toolbarTpl([{
							id: 'newCode',  icon: 'file-code',  title: '新建代码'}, {
							id: 'filter',   icon: 'filter',     title: '过滤'
						}]).join('')
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
			, id = req.query.id || '0'
			;

		if( id !== '0' ){
			db.query(code.sql, [id], function(e, rs){
				if( !e ){
					rs = code.handler( rs );

					res.send( resCode(rs) );
				}
				else{
					console.log('\n', 'db', '\n', code.sql, '\n', e.message);
				}
				res.end();
			});
		}
		else{
			res.send( resCode({Id: 0, js_lib: '../script/lib/jquery.min.js'}) );
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

	// 测试用数据
	web.get('/editor/getJSON', function(req, res){
		res.send('{"title":"这是一个 JSON ","data":[{},{},{},{}]}');
		res.end();
	});
	web.get('/editor/import.html', function(req, res){
		res.end();
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
		, 'editor/save': function(socket, data){
			var arr = []
				, query = data.query
				, id = query.id || ''
				, sql
				;

			arr.push.call(arr, query.html, query.css, query.js, query.cssLib, query.jsLib);

			if( id !== '0' ){
				sql = editor.edit;
				arr.unshift( query.codeName );
				arr.push( id );
			}
			else if( id === '0' ){
				sql = editor.save;
				arr.push( query.codeName );
			}
			db.query(sql.sql, arr, function(e, rs){
				if( !e ){
					socket.emit('getData', {
						topic: 'editor/save'
						, msg: 'success'
						, id: rs.insertId || id
					});
				}
				else{
					console.log('\n', 'db', '\n', sql.sql, '\n', e.message);
				}
			});
		}
	});
};