'use strict';

var db          = require('./db.js')
	, web       = require('./web.js')
	, socket    = require('./socket.js')
	, error     = require('./error.js')

	, index     = require('./index.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, bower     = require('./bower.js')

	//, tag       = require('./tag.js')
	, tagView   = require('./tag/view.js')
	, image     = require('./image.js')

	, PREVIEW_SIZE = 128
	, PREVIEW_WIDTH = 128
	, codeTpl       = emmetTpl({
		template: 'a[href=code?id=%Id%]' +
			'>article.article.editor_article' +
				'>h3.article_title{%name%}' +
				'+img.article_preview[src=%preview% width=%width% height=%height% alt=%alt%]' +
				'+div.tagsArea{%tags%}'
		, filter:{
			width: function(d){
				var w = d.width
					, h = d.height
					, rs
					;
				if( w <= PREVIEW_SIZE && h <= PREVIEW_SIZE ){
					rs = w;
				}
				else if( w >= h ){
					rs = PREVIEW_SIZE;
				}
				else{
					rs = Math.floor( PREVIEW_SIZE/h * w );
				}

				return rs;
			}
			, height: function(d){
				var w = d.width
					, h = d.height
					, rs
					;
				if( w <= PREVIEW_SIZE && h <= PREVIEW_SIZE ){
					rs = h;
				}
				else if( h >= w ){
					rs = PREVIEW_SIZE;
				}
				else{
					rs = Math.floor( PREVIEW_SIZE/w * h );
				}

				return rs;
			}
			,alt:function(data, index){
				return data.preview ? data.name : '没有预览图片';
			}
			, tags: tagView.tagEditorFilter.tagsArea
		}
	})
	, codeEditTpl   = emmetTpl({
		template:
			'form#editorForm.editor_form[action=result method=post target=result]' +
				'>button#save.icon.icon-save.editor_op[type=submit title=保存]' +
				'+button#run.icon.icon-play.editor_op[type=button title=运行]' +
				'+input#id[type=hidden name=id value=%Id%]' +
				'+input#cssLib[type=hidden name=cssLib value=%css_lib%]' +
				'+input#jsLib[type=hidden name=jsLib value=%js_lib%]' +
				'+h3#editorTitle.editor_title>input#name.input[type=text name=name value=%name% placeholder=新建前端代码]' +
				'^div.editor_area.editor_area-html' +
					'>textarea#html.hidden[name=html placeholder=body&nbsp;之间的&nbsp;HTML&nbsp;代码]{%html%}' +
					'+label.hidden[for=html]{HTML}' +
				'^div.editor_area.editor_area-js' +
					'>textarea#js.hidden[name=js placeholder=JavaScript&nbsp;代码]{%js%}' +
					'+label.hidden[for=js]{JavaScript}' +
				'^div.editor_area.editor_area-css' +
					'>textarea#css.hidden[name=css placeholder=CSS&nbsp;代码]{%css%}' +
					'+label.hidden[for=css]{CSS}' +
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
	, codeSetMoreFormTpl   = emmetTpl({
		template: 'form#setMoreForm[method=post action=setMore target=editorSetMoreRs enctype=multipart/form-data]' +
			'>input#codeId[type=hidden name=id value=%Id%]' +
			'+div.formGroup' +
				'>label.label[for=codeName]{请输入名称}' +
				'+input#codeName.input[type=text name=name value=%name% placeholder=请输入名称 data-validator=title]' +
			'^div.formGroup' +
				'>label.label[for=preview]{请添加预览图片}' +
				'+input[type=hidden name=type value=preview]' +
				'+input#preview.input[type=file name=preview]' +
			'^' + tagView.tagEditorEmmet +
		    '^fieldset' +
				'>legend' +
					'>label' +
						'>input[type=checkbox name=setUI value=1]' +
						'+span#setM{更多设置}' +

				'^^div.group.hidden' +
				'>input[type=hidden name=setUI value=1]' +
				'+div.formGroup' +
					'>label.label[for=uiName]{请设置 UI 组件名称}' +
					'+input#uiName.input[type=text name=uiName placeholder=请设置UI组件名称 data-validator=uiName]' +
				'^div.formGroup' +
					'>label.label[for=uiName]{请设置 UI 组件名称}' +
					'+input#uiName.input[type=text name=uiName placeholder=请设置UI组件名称 data-validator=uiName]' +
			'^^^iframe#editorSetMoreRs.hidden[name=editorSetMoreRs]'
		, filter: tagView.tagEditorFilter
	})

	, Promise = require('promise')

	//, htmlTag = 'DOCTYPE,a,abbr,acronym,address,applet,area,article,aside,audio,b,base,basefont,bdi,bdo,big,blockquote,body,br,button,canvas,caption,center,cite,code,col,colgroup,command,datalist,dd,del,details,dir,div,dfn,dialog,dl,dt,em,embed,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,isindex,kbd,keygen,label,legend,li,link,map,mark,menu,menuitem,meta,meter,nav,noframes,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rp,rt,tuby,s,samp,script,section,select,small,source,span,strike,strong,style,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr,xmp'


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
			, editorPage: 'select editor.Id,editor.name,preview,tags,width,height from editor,image where ' +
				//'status=1 and ' +
				'editor.preview=image.src order by editor.Id limit :page,:size'
			, code: 'select Id,name,tags,css_lib,js_lib,html,css,js from editor where Id=:id'
			, codeSave: 'insert into editor(status,html,css,js,css_lib,js_lib,name,preview,create_time) values(1,:html,:css,:js,:cssLib,:jsLib,:name,:preview,now())'
			, codeEdit: 'update editor set status=1,name=:name,html=:html,css=:css,js=:js,css_lib=:cssLib,js_lib=:jsLib where Id=:id'
			, codeSetMore: 'update editor set status=1,name=:name,tags=:tags,preview=:preview where Id=:id'
		}

		/**
		 * @namespace   Handler
		 * @memberof    Editor
		 * @desc    数据处理方法集合
		 * */
		, Handler: {
			code: function(rs){
				//rs = rs.result;

				rs = rs[0];
				rs.html = rs.html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;');
				rs.css = rs.css.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;');
				rs.js = rs.js.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;');

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
				//rs = rs.result;

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
							id: 'changeLayout', icon: 'layout', title: '更改布局'}, {
							id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'}, {
							id: 'getDemoImg',   icon: 'picture',title: '素材'}, {
							id: 'getUiLib',     icon: 'lib',    title: '引用组件'}, {
							id: 'newWin',       icon: 'window', title: '在新窗口浏览'}, {
							id: 'set',          icon: 'settle', title: '更多设置'
						}]).join('')
						, content: codeEditTpl(rs).join('')
					}).join('') + tpl.popupTpl([{
						id: 'msgPopup',    size: 'small', content: '<div class="msg" id="msgContent"></div>'}, {
						id: 'setMore',   size: 'normal'
							, content: codeSetMoreFormTpl(rs)
							, button: '<button type="button" id="codeSave" class="btn btn-submit">保存</button>'}, {
						id: 'uiLib',    size: 'normal'
							, content: '<dl class="list-tree" id="uiLibList"></dl>'
							, button: '<button type="button" id="sure" class="btn btn-submit">确定</button>'}, {
						id: 'demoImgLib',   size: 'large'
							, content: demoImgUploadFormTpl({})
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
index.push({
	id: 'editor'
	, type: 'metro'
	, size: 'normal'
	, title: '编辑器 editor'
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
			, js_lib: 'jquery/dist/jquery.js'
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

web.post('/editor/setMore', image.uploadMiddle.single('preview'), function(req, res){
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
		//rs = rs.result;

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
		, data = {
			height: size.height
			, width: size.width
			, src: file.path.replace(/\\/g, '/').replace('public', '..')
			, type: type === 'demo' ? 5 : 1
		}
		;

	db.handle({
		sql: image.Model.imageAdd
		, data: data
	}).then(function(rs){
		//var data = rs.data;

		//rs = rs.result;

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

var SKIN_LIST = [{
	name: 'default'}, {
	name: '3024-day'}, {
	name: '3024-night'}, {
	name: 'ambiance'}, {
	name: 'base16-dark'}, {
	name: 'base16-light'}, {
	name: 'blackboard'}, {
	name: 'cobalt'}, {
	name: 'eclipse'}, {
	name: 'elegant'}, {
	name: 'erlang-dark'}, {
	name: 'lesser-dark'}, {
	name: 'mbo'}, {
	name: 'mdn-like'}, {
	name: 'midnight'}, {
	name: 'monokai'}, {
	name: 'neat'}, {
	name: 'neo'}, {
	name: 'night'}, {
	name: 'paraiso-dark'}, {
	name: 'paraiso-light'}, {
	name: 'pastel-on-dark'}, {
	name: 'rubyblue'}, {
	name: 'solarized'}, {
	name: 'the-matrix'}, {
	name: 'tomorrow-night-bright'}, {
	name: 'tomorrow-night-eighties'}, {
	name: 'twilight'}, {
	name: 'vibrant-ink'}, {
	name: 'xq-dark'}, {
	name: 'xq-light'}, {
	name: 'zenburn'
}];
web.get('/data/layout', function(req, res){

});
web.get('/data/skin', function(req, res){
	var session = req.session || {}
		, user = session.user
		, rs = SKIN_LIST
		;

	if( user && user.skin ){
		rs.forEach(function(d){
			if( d.name === user.skin ){
				d.on = 'on';
			}
		});
	}
	else{
		rs[0].on = 'on';
	}

	res.send( JSON.stringify(rs) );
	res.end();
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
			//rs = rs.result;

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
				//rs = rs.result;

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

		handleData = query;

		if( id !== '0' ){
			handle.sql = Editor.Model.codeEdit;

			handleData.id = id;
		}
		else{
			handle.sql = Editor.Model.codeSave;
			handleData.preview = handleData.preview || '../image/default/no-pic.png';
		}

		handle.data = handleData;

		db.handle( handle ).then(function(rs){
			//rs = rs.result;

			socket.emit('data', {
				topic: 'editor/code/save'
				, info: {
					id: rs.insertId || id
				}
			});
		});
	}
	, 'editor/lib': function(socket, data){
		db.handle({
			sql: bower.Model.bower
		}).then(function(rs){
			//rs = rs.result;

			socket.emit('data', {
				topic: 'editor/lib'
				, data: rs
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
				, data: rs//.result
			});
		});
	}
});

module.exports = Editor;

