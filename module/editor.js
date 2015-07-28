'use strict';

var db          = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, metro     = require('./metro.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, tag       = require('./tag.js')
	, image     = require('./image.js')

	, codeTpl       = emmetTpl({
		template: 'a[href=code?id=%Id%]' +
				'>article.article.editor_article' +
				'>h3.article_title{%name%}' +
				'+img.article_preview[src=%preview% width=%width% height=%height% alt=%alt%]' +
				'+div.tagsArea{%tags%}'
		, filter:{
			alt:function(data, index){
				return data.preview ? data.name : '没有预览图片';
			}
			, tags: function(d){
				return d.tags ? '<span class="tag tag-checked">' + d.tags.split(',').join('</span><span class="tag tag-checked">') + '</span>' : '';
			}
		}
	})
	, codeEditTpl   = emmetTpl({
		template: 'h3#editorTitle.editor_title{%name%}' +
			'+form#editorForm.editor_form[action=result method=post target=result]' +
				'>input#id[type=hidden name=id value=%Id%]' +
				'+input#cssLib[type=hidden name=css_lib value=%css_lib%]' +
				'+input#jsLib[type=hidden name=js_lib value=%js_lib%]' +
				'+div.editor_area.editor_area-html' +
					'>textarea#html.hidden[name=html placeholder=body&nbsp;之间的&nbsp;HTML&nbsp;代码]{%html%}' +
					'+label.hidden[for=html]{HTML}' +
				'^div.editor_area.editor_area-css' +
					'>textarea#css.hidden[name=css placeholder=CSS&nbsp;代码]{%css%}' +
					'+label.hidden[for=css]{CSS}' +
				'^div.editor_area.editor_area-js' +
					'>textarea#js.hidden[name=js placeholder=JavaScript&nbsp;代码]{%js%}' +
					'+label.hidden[for=js]{JavaScript}' +
				'^div.editor_area.editor_area-rs' +
					'>iframe#result.editor_rs[name=result src=result]' +
					'+label.hidden{Result}'
	})
	, demoImgUploadFormTpl  = emmetTpl({
		template: 'form#demoImgUploadForm[method=post action=demoImgUpload target=demoImgUploadRs enctype=multipart/form-data]' +
			'>div.formGroup' +
				'>label.label[for=image]{添加素材}' +
				'+input[type=hidden name=type value=demo]' +
				'+input#image.input[type=file name=image]' +
				'+button.btn.btn-submit[type=submit]{上传}' +
		'^^iframe#demoImgUploadRs.hidden[name=demoImgUploadRs]' +
		'+ul#demoImgList.list-img' +
			'>li.list_item.block' +
				'>div.loading.loading-chasing'
		//+
		//'<form id="demoImgUploadForm" method="post" action="demoImgUpload" target="demoImgUploadRs" enctype="multipart/form-data">' +
		//	'<div class="formGroup">' +
		//		'<label class="label" for="image">添加素材</label>' +
		//		'<input type="hidden" name="type" value="demo"/>' +
		//		'<input type="file" id="image" class="input" name="image"/>' +
		//		'<button class="btn btn-submit" type="submit">上传</button>' +
		//	'</div>' +
		//'</form>' +
		//'<iframe name="demoImgUploadRs" id="demoImgUploadRs" class="hidden"></iframe>' +
		//'<ul class="list-img" id="demoImgList">' +
		//	'<li class="list_item block"><div class="loading loading-chasing"></div></li>' +
		//'</ul>'
	})
	, codeSaveFormTpl   = emmetTpl({
		template: 'form#saveForm[method=post action=save target=editorSaveRs enctype=multipart/form-data]' +
			'>div.formGroup' +
				'>label.label[for=codeName]{请输入名称}' +
				'+input#codeName.input[type=codeName name=codeName value=%name% placeholder=请输入标题 data-validator=title]' +
			'^div.formGroup' +
				'>label.label[for=preview]{请添加预览图片}' +
				'+input[type=hidden name=type value=preview]' +
				'+input#preview.input[type=file name=preview]' +
			'^' + tag.tagEditorEmmet +
		    '^button.btn.btn-link[type=button]{更多设置}' +
			'+fieldset.hidden' +
				'>legend{设置为 UI 组件}' +
				'+input[type=hidden name=setUI value=1]' +
				'+div.formGroup' +
					'>label.label[for=uiName]{请设置 UI 组件名称}' +
					'+input#uiName.input[type=text name=uiName placeholder=请设置 UI 组件名称 data-validator=uiName]' +
			'^^^iframe#editorSaveRs.hidden[name=editorSaveRs]'
			//'<form id="saveForm" method="post" action="save" target="editorSaveRs" enctype="multipart/form-data">' +
			//	'<div class="formGroup">' +
			//		'<label class="label" for="codeName">请输入名称</label>' +
			//		'<input type="text" id="codeName" class="input" placeholder="请输入标题" value="%name%"  data-validator="title"/>' +
			//	'</div>' +
			//	'<div class="formGroup">' +
			//		'<label class="label" for="preview">请添加预览图片</label>' +
			//		'<input type="hidden" name="type" value="preview"/>' +
			//		'<input type="file" id="preview" class="input" name="preview"/>' +
			//	'</div>' +
			//	tag.View.tagEditor(rs) +
			//	'<button type="button" class="btn btn-link">更多设置</button>' +
			//	'<fieldset>' +
			//		'<legend>设置为 UI 组件</legend>' +
			//		'<input type="hidden" name="setUI" value="1"/>' +
			//		'<div class="formGroup">' +
			//			'<label class="label" for="uiName">UI 组件名称</label>' +
			//			'<input type="text" id="uiName" class="input" name="uiName" data-validator="uiName"/>' +
			//		'</div>' +
			//	'</fieldset>' +
			//'</form>' +
			//'<iframe name="editorSaveRs" id="editorSaveRs" class="hidden"></iframe>'
		, filter: tag.tagEditorFilter
	})

	, Promise = require('promise')

	/**
	 * @namespace   Editor
	 * */
	, Editor = {
		/**
		 * @namespace   Model
		 * @memberof    Editor
		 * @desc    业务相关 sql 语句集合
		 * */
		Model: {
			editor: 'select editor.Id,editor.name,preview,tags,width,height from editor,image where status=1 and editor.preview=image.src order by editor.Id'
			, editorCount: 'select count(*) as count from editor where status=1'
			, editorPage: 'select editor.Id,editor.name,preview,tags,width,height from editor,image where status=1 and editor.preview=image.src order by editor.Id limit :page,:size'
			, code: 'select Id,name,tags,css_lib,js_lib,html,css,js from editor where Id=:id'
			, codeEdit: 'update editor set name=:name,html=:html,css=:css,js=:js,css_lib=:cssLib,js_lib=:jsLib,tags=:tags where Id=:id'
			, codeSave: 'insert into editor(status,html,css,js,css_lib,js_lib,name,preview,create_time,tags) values(1,:html,:css,:js,:cssLib,:jsLib,:name,:preview,now(),?)'
		}

		/**
		 * @namespace   Handler
		 * @memberof    Editor
		 * @desc    数据处理方法集合
		 * */
		, Handler: {
			code: function(rs){
				rs = rs.result;

				rs = rs[0];
				rs.html = rs.html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

				return rs;
			}
		}

		/**
		 * @namespace   View
		 * @memberof    Editor
		 * @desc    视图模板集合
		 * */
		, View: {
			editor: function(rs){
				rs = rs.result;

				return tpl.html('module', {
					title: '前端编辑器 Editor'
					, modules: tpl.mainTpl({
						id: 'editor'
						, title: '前端编辑器 editor'
						, toolbar: '<li><a href="code?id=0" id="newCode" class="icon icon-file-code" title="新建代码"></a></li>' +
							tpl.toolbarTpl([{
								id: 'filter',   icon: 'filter',     title: '过滤'
							}]).join('')
						, content: codeTpl(rs).join('')
					}).join('')
					, script: {
						main: '../script/module/editor/index'
						, src: '../script/lib/require.min.js'
					}
				});
			}
			, code: function(rs){

				return tpl.html('module', {
					title: '前端编辑器 Editor'
					, modules: tpl.mainTpl({
						id: 'editor'
						, title: '前端编辑器 editor'
						, toolbar: tpl.toolbarTpl([{
							id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'}, {
							id: 'changeLayout', icon: 'layout', title: '更改布局'}, {
							id: 'getDemoImg',   icon: 'picture',title: '素材'}, {
							id: 'getUiLib',     icon: 'lib',    title: '引用组件'}, {
							id: 'newWin',       icon: 'window', title: '在新窗口浏览'}, {
							id: 'run',          icon: 'play',   title: '运行'}, {
							id: 'save',         icon: 'save',   title: '保存'
						}]).join('')
						, content: codeEditTpl(rs).join('')
					}).join('') + tpl.popupTpl([{
						id: 'alert',    size: 'small', content: '<div class="msg" id="alertContent"></div>'
							, button: '<button type="button" id="" class="btn module_close">确定</button>'}, {
						id: 'editorSave',   size: 'normal'
							, content: codeSaveFormTpl(rs)
							, button: '<button type="button" id="codeSave" class="btn">保存</button>'}, {
						id: 'uiLib',    size: 'normal'
							, content: '<dl class="list-tree" id="uiLibList"></dl>'
							, button: '<button type="button" id="" class="btn">确定</button>'}, {
						id: 'demoImgLib',   size: 'large'
							, content: demoImgUploadFormTpl({})
						//'<form id="demoImgUploadForm" method="post" action="demoImgUpload" target="demoImgUploadRs" enctype="multipart/form-data">' +
						//			'<div class="formGroup">' +
						//				'<label class="label" for="image">添加素材</label>' +
						//				'<input type="hidden" name="type" value="demo"/>' +
						//				'<input type="file" id="image" class="input" name="image"/>' +
						//				'<button class="btn btn-submit" type="submit">上传</button>' +
						//			'</div>' +
						//		'</form>' +
						//		'<iframe name="demoImgUploadRs" id="demoImgUploadRs" class="hidden"></iframe>' +
						//		'<ul class="list-img" id="demoImgList">' +
						//			'<li class="list_item block"><div class="loading loading-chasing"></div></li>' +
						//		'</ul>'
					}]).join('')
					, script: {
						main: '../script/module/editor/code'
						, src: '../script/lib/require.min.js'
					}
				});
			}
		}
	}
	;

// 注册首页 metro 模块
metro.push({
	id: 'editor'
	, type: 'metro'
	, size: 'normal'
	, title: '前端编辑器 editor'
});

web.get('/editor/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	page = page < 1 ? 1 : page;
	size = size < 1 ? 20 : size;

	db.handle({
		sql: Editor.Model.editorPage
		, data: {
			page: (page-1) * size
			, size: size
		}
	}).then( Editor.View.editor ).then(function(html){
		res.send( html );
		res.end();
	});
});
web.get('/editor/code', function(req, res){
	var id = req.query.id || '0'
		;

	if( id !== '0' ){

		db.handle({
			sql: Editor.Model.code
			, data: {
				id: id
			}
		}).then( Editor.Handler.code ).then( Editor.View.code ).then(function(html){
			res.send( html );
			res.end();
		});
	}
	else{
		res.send( Editor.View.code({
			Id: 0
			, js_lib: 'jquery/dist/jquery.min.js'
		}) );
		res.end();
	}
});

web.get('/editor/codePanel', function(req, res){
	// todo
});
web.get('/editor/result', function(req, res){
	var id = req.query.id || ''
		, css_lib
		, js_lib
		, temp
		;

	//if( id ){
	//
	//	db.handle({
	//		sql: Editor.Model.code
	//		, data: [id]
	//	}).then(function(rs){
	//		rs = rs.result;
	//
	//		var data = rs[0];
	//
	//		data = data[0];
	//
	//		css_lib = (data.css_lib || '').split(',').map(function(d){
	//			return {path: d};
	//		});
	//		js_lib = (data.js_lib || '').split(',').map(function(d){
	//			return {src: d};
	//		});
	//
	//		res.send(tpl.html('editor/result', {
	//			title: '运行结果'
	//			, stylesheet:   css_lib
	//			, style:        {style:data.css}
	//			, modules:      data.html
	//			, script:       js_lib
	//			, scriptCode:   {script:data.js}
	//		}) );
	//		res.end();
	//	});
	//}
	//else{
	//	res.end();
	//}

	res.end();
});

web.post('/editor/save', image.uploadMiddle.single('preview'), function(req, res){
	var body = req.body || {}
		, type = body.type
		;

	var handle = {}
		, handleData
		, query = data.query
		, id = query.id || ''
		;

	handleData = {
		name:       query.codeName
		, html:     query.html
		, css:      query.css
		, js:       query.js
		, cssLib:   query.cssLib
		, jsLib:    query.jsLib
		, tags:     query.tags
		, preview:  query.preview || '../image/default/no-pic.png'
	};

	if( id !== '0' ){
		handle.sql = Editor.Model.codeEdit;

		handleData.id = id;
	}
	else{
		handle.sql = Editor.Model.codeSave;
	}

	handle.data = handleData;

	db.handle( handle ).then(function(rs){
		rs = rs.result;

		res.send( JSON.stringify({
			Id: rs.insertId || id
		}) );
		//socket.emit('data', {
		//	topic: 'editor/code/save'
		//	, info: {
		//		id: rs.insertId || id
		//	}
		//});
	});
});

web.post('/editor/demoImgUpload', image.uploadMiddle.single('image'), function(req, res){
	var body = req.body || {}
		, type = body.type
		, file = req.file
		, size = image.sizeOf( req.file.path )
		;

	db.handle({
		sql: image.Model.imageAdd
		, data: {
			height: size.height
			, width: size.width
			, src: file.path.replace(/\\/g, '/').replace('public', '..')
			, type: type === 'demo' ? 5 : 1
		}
	}).then(function(rs){
		var data = rs.data;

		rs = rs.result;

		data.Id = rs.insertId;

		res.send( JSON.stringify(data) );
		res.end();
	})
});

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
//web.get('/editor/import.html', function(req, res){
//	res.end();
//});

/**
 * 数据接口
 * */
web.get('/data/example', function(req, res){
	res.send('{"title":"这是一个 JSON","data":[{},{},{},{}],"flag":true,"num":10}');
	res.end();
});
web.get('/data/editor', function(req, res){
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

		handle.sql = Editor.Model.editorPage;
		handle.data = {
			page: (page-1) * size
			, size: size
		};
	}
	else{
		handle.sql = Editor.Model.editor;
	}

	db.handle( handle ).then(function(rs){
		rs = JSON.stringify( rs.result );

		res.send( callback ? callback +'('+ rs +')' : rs );
		res.end();
	});
});
web.get('/data/code', function(req, res){
	var id = req.query.id
		, callback = req.query.callback
		;

	if( id ){
		db.handle({
			sql: Editor.Model.code
			, data: {
				id: id
			}
		}).then(function(rs){
			rs = JSON.stringify( rs.result[0] );

			res.send( callback ? callback + '('+ rs +')' : rs );
			res.end();
		})
	}
	else{
		res.end();
	}
});

socket.register({
	editor: function(socket, data){
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

			handle.sql = Editor.Model.editorPage;
			handle.data = {
				page: (page-1) * size
				, size: size
			};
		}
		else{
			handle.sql = Editor.Model.editor;
		}

		db.handle( handle ).then(function(rs){
			rs = rs.result;

			socket.emit('data', {
				topic: 'editor'
				, data: rs
			});
		});
	}
	, 'editor/code': function(socket, data){
		var send = {
				topic: 'editor/code'
			}
			, id = data.query.id
			;

		if( id ){
			db.handle({
				sql: Editor.Model.code
				, data: {
					id: id
				}
			}).then(function(rs){
				rs = rs.result;

				send.info = rs[0];

				socket.emit('data', send);
			});
		}
		else{
			send.error = '';
			send.msg = '缺少参数';

			socket.emit('data', send);
		}
	}
	, 'editor/code/save': function(socket, data){
		var handle = {}
			, handleData
			, query = data.query
			, id = query.id || ''
			;

		handleData = {
			name:       query.codeName
			, html:     query.html
			, css:      query.css
			, js:       query.js
			, cssLib:   query.cssLib
			, jsLib:    query.jsLib
			, tags:     query.tags
			, preview:  query.preview || '../image/default/no-pic.png'
		};

		if( id !== '0' ){
			handle.sql = Editor.Model.codeEdit;

			handleData.id = id;
		}
		else{
			handle.sql = Editor.Model.codeSave;
		}

		handle.data = handleData;

		db.handle( handle ).then(function(rs){
			rs = rs.result;

			socket.emit('data', {
				topic: 'editor/code/save'
				, info: {
					id: rs.insertId || id
				}
			});
		});
	}
	, 'editor/demoImgLib': function(socket, data){
		var query = data.query || {}
			;

		db.handle({
			sql: image.Model.imageByAlbum
			, data: {
				albumId: 5
			}
		}).then(function(rs){

			socket.emit('data', {
				topic: 'editor/demoImgLib'
				, data: rs.result
			});
		});
	}
});

module.exports = Editor;