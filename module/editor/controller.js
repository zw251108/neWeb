'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config.js')

	, index     = require('../index.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')
	, EditorError   = require('./error.js')

	// 外部数据模块引用
	, LibModel      = require('../bower/model.js')

	, Image         = require('../image/image.js')
	, ImageModel    = require('../image/model.js')
	, ImageError    = require('../image/error.js')

	, Promise = require('promise')

	, DEFAULT_ALBUM_ID = 1
	, EDITOR_DEMO_ALBUM_ID = 5
	, EDITOR_PREVIEW_ALBUM_ID = 2
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
		, keyword = query.keyword || ''
		, execute
		;

	if( keyword ){
		execute = Model.searchEditorByName(keyword, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countSearchEditorByName(keyword).then(function(count){
					return {
						data: rs
						, index: page
						, size: size
						, count: count
						, urlCallback: function(index){
							return '?keyword='+ keyword +'&page='+ index;
						}
					};
				});
			}
			else{
				result = {
					data: []
					, index: 1
					, size: size
					, count: 0
					, urlCallback: function(index){
						return '?keyword='+ keyword +'&page='+ index;
					}
				};
			}

			return result;
		});
	}
	else{
		execute = Model.getEditorByPage(page, size).then(function(rs){
			return Model.countEditor().then(function(count){
				return {
					data: rs
					, index: page
					, size: size
					, count: count
					, urlCallback: function(index){
						return '?page='+ index;
					}
				};
			});
		});
	}
	execute.then( View.editorList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/editor/code', function(req, res){
	var query = req.query || {}
		, id = query.id
		, execute
		;

	if( id !== '0' ){
		execute = Model.getEditorById(id);
	}
	else{
		execute = Promise.resolve({
			Id: 0
			, js_lib: 'jquery/dist/jquery.js'
		});
	}

	execute.then( View.editor ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/editor/result', function(req, res){
	res.end();
});

web.post('/editor/setMore', Image.uploadMiddle.single('preview'), function(req, res){
	var body = req.body || {}
		, type = body.type
		, id = body.id
		, file = req.file
		, size
		, imgData
		, execute
		;
	console.log(req.file);
	if( id ){
		if( file ){
			size = Image.sizeOf( req.file.path );
			imgData = {
				src: file.path.replace(/\\/g, '/').replace('public', '..')
				, type: type === 'preview' ? EDITOR_PREVIEW_ALBUM_ID : DEFAULT_ALBUM_ID
				, height: size.height
				, width: size.width
			};

			ImageModel.addImage( imgData ).then(function(rs){
				if( rs && rs.insertId ){
					console.log(imgData.src + '同名图片已存在');
				}

				return Promise.resolve('');
			});

			execute = Model.updateEditorSetImg({
				id: body.id
				, name: body.name
				, tags: body.tags
				, preview: imgData.src
			});
		}
		else{
			execute = Model.updateEditorSet({
				id: body.id
				, name: body.name
				, tags: body.tags
			});
		}

		execute = execute.then(function(rs){
			var result
				;

			if( rs && rs.changedRows ){
				result = {
					success: true
				};
			}
			else{
				result = Promise.reject( new EditorError('设置失败') );
			}

			return result;
		});
	}
	else{
		execute = Promise.reject( new EditorError('缺少参数') );
	}

	execute.catch(function(e){
		console.log(e);

		return {
			success: false
			, error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.post('/editor/demoImgUpload', Image.uploadMiddle.single('image'), function(req, res){
	var body = req.body || {}
		, type = body.type
		, file = req.file
		, size = Image.sizeOf( req.file.path )
		, imgData = {
			src: file.path.replace(/\\/g, '/').replace('public', '..')
			, type: type === 'demo' ? EDITOR_DEMO_ALBUM_ID : DEFAULT_ALBUM_ID
			, height: size.height
			, width: size.width
		}
		;

	ImageModel.addImage( imgData ).then(function(rs){
		var result;

		if( rs && rs.insertId ){
			data.Id = rs.insertId;

			result = {
				success: true
				, info: data
			};
		}
		else{
			result = Promise.reject( new ImageError('图片已存在') );
		}

		return result;
	}).catch(function(e){
		console.log( e );

		return {
			success: false
			, error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});

socket.register({
	editor: function(socket, data){
		var query = data.query || {}
			, page = query.page || 1
			, size = query.size || 20
			;

		Model.getEditorByPage(page, size).then(function(rs){
			socket.emit('data', {
				topic: 'editor'
				, data: rs
			});
		});
	}
	, 'editor/search': function(socket, data){
		var send = {
				topic: 'editor/search'
			}
			, query = data.query || {}
			, keyword = query.keyword
			, page = query.page || 1
			, size = query.size || 20
			, execute
			;

		if( keyword ){
			execute = Model.searchEditorByName(keyword, page, size).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					send.data = rs;

					result = Model.countSearchEditorByName(keyword).then(function(count){
						send.count = count;

						return send;
					});
				}
				else{
					send.data = [];
					send.count = 0;

					result = send;
				}

				return result;
			});
		}
		else{
			execute = Promise.reject( new EditorError('缺少参数') );
		}

		execute.catch(function(e){
			console.log( e );

			send.error = '';
			send.msg = e.message;

			return send;
		}).then(function(send){
			socket.emit('data', send);
		});
	}
	, 'editor/code': function(socket, data){}
	, 'editor/code/save': function(socket, data){
		var query = data.query
			, id = query.id || ''
			, execute
			;

		if( id !== '0' ){
			execute = Model.updateEditor(query);
		}
		else{
			execute = Model.addEditor(query);
		}

		execute.then(function(rs){
			socket.emit('data', {
				topic: 'editor/code/save'
				, info: {
					id: rs.insertId || id
				}
			});
		});
	}
	, 'editor/lib': function(socket, data){
		LibModel.getBowerAll().then(function(rs){
			socket.emit('data', {
				topic: 'editor/lib'
				, data: rs
			});
		});
	}
	, 'editor/demoImgLib': function(socket, data){
		ImageModel.getImageByAlbum( EDITOR_DEMO_ALBUM_ID ).then(function(rs){
			socket.emit('data', {
				topic: 'editor/demoImgLib'
				, data: rs
			});
		});
	}
});