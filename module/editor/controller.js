'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')
	, EditorError   = require('./error.js')

	// 外部数据模块引用
	, LibModel      = require('../bower/model.js')
	, TagModel      = require('../tag/model.js')
	, User          = require('../user/user.js')

	, Image         = require('../image/image.js')
	, ImageModel    = require('../image/model.js')
	, ImageError    = require('../image/error.js')

	, Promise = require('promise')

	, DEFAULT_ALBUM_ID = 1
	, EDITOR_DEMO_ALBUM_ID = 5
	, EDITOR_PREVIEW_ALBUM_ID = 2
	;

modules.register({
	id: 'editor'
	, metroSize: 'tiny'
	, title: '代码 code'
	, icon: 'code'
	, href: 'editor/'
	, hrefTitle: '代码列表'
}, {
	id: 'code'
	, metroSize: 'tiny'
	, title: '编辑器 editor'
	, icon: 'editor'
	, href: 'editor/code?id=0'
	, hrefTitle: '新建代码'
});

web.get('/editor/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		, keyword = query.keyword || ''
		, tags = query.tags || ''
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
	else if( tags ){
		execute = Model.filterEditorByTag(tags, page, size).then(function(rs){
			var result
				;

			if( rs && rs.length ){
				result = Model.countFilterEditorByTag(tags).then(function(count){
					return {
						data: rs
						, index: page
						, size: size
						, count: count
						, urlCallback: function(index){
							return '?tags='+ tags +'&page='+ index;
						}
					}
				});
			}
			else{
				result = {
					data: []
					, index: 1
					, size: size
					, count: 0
					, urlCallback: function(index){
						return '?tags='+ tags + '&page='+ index;
					}
				}
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
		, tags = body.tags
		, file = req.file
		, size
		, imgData
		, execute
		;

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
				id: id
				, name: body.name
				, tags: tags
				, preview: imgData.src
			});
		}
		else{
			execute = Model.updateEditorSet({
				id: id
				, name: body.name
				, tags: tags
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

	//Promise.all( tags.split(',').map(function(d){
	//	return TagModel.increaseByName(d, 1);
	//}) );

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
	, 'editor/filter': function(socket, data){
		var send = {
				topic: 'editor/filter'
			}
			, query = data.query || {}
			, tags = query.tags
			, page = query.page || 1
			, size = query.size || 20
			, execute
			;

		if( tags ){
			execute = Model.filterEditorByTag(tags, page, size).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					send.data = rs;

					result = Model.countFilterEditorByTag(tags).then(function(count){
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
			, user = User.getUserFromSession.fromSocket(socket)
			;

		query.userId = user.id;

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
	, 'editor/lib': function(socket){
		LibModel.getBowerAll().then(function(rs){
			socket.emit('data', {
				topic: 'editor/lib'
				, data: rs
			});
		});
	}
	, 'editor/demoImgLib': function(socket){
		ImageModel.getImageByAlbum( EDITOR_DEMO_ALBUM_ID ).then(function(rs){
			socket.emit('data', {
				topic: 'editor/demoImgLib'
				, data: rs
			});
		});
	}
});