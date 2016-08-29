'use strict';

var CONFIG  = require('../../config.js')
	, web       = require('../web.js')
	, socket    = require('../socket.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	// 外部数据模块引用
	, UserHandler   = require('../user/handler.js')
	, ImageHandler  = require('../image/handler.js')
	, TagHandler    = require('../tag/handler.js')

	, LibModel      = require('../bower/model.js')

	, CodeView      = require('./view.js')
	, CodeAdminView = require('./admin.view.js')
	, CodeHandler   = require('./handler.js')

	, DEMO_IMG_UPLOAD   = '/code/demoImgUpload'
	, SET_MORE          = '/code/setMore'
	;

modules.register({
	id: 'code'
	, metroSize: 'tiny'
	, title: '代码库 code'
	, icon: 'code'
	, href: 'code/'
	, hrefTitle: '代码列表'
}, {
	id: 'editor'
	, metroSize: 'tiny'
	, title: '编辑器 editor'
	, icon: 'editor'
	, href: 'code/editor?id=0'
	, hrefTitle: '新建代码'
});

menu.register({
	id: 'editor'
	, title: '代码库 code'
	, icon: 'code'
	, href: 'code/'
}, {
	id: 'code'
	, title: '编辑器 editor'
	, icon: 'editor'
	, href: 'code/editor?id=0'
});

web.get('/code/', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	CodeHandler.getCodeList(user, query).then( CodeView.codeList ).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});
web.get('/code/editor', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	CodeHandler.getCode(user, query).then( CodeView.editor ).then(function(html){
		res.send( CONFIG.docType.html5 + html );
		res.end();
	});
});

web.post('/code/setMore', ImageHandler.uploadMiddleware.single('preview'), function(req, res){
	var body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	ImageHandler.uploadImage(user, req).then(function(data){
		body.imgId = data.id;
		body.src = data.src;

		return body;
	}, function(e){
		console.log( e );

		return body;
	}).then(function(data){
		return CodeHandler.setMoreCode(user, data);
	}).then(function(data){
		return {
			data: [data]
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.post('/code/demoImgUpload', ImageHandler.uploadMiddleware.single('image'), function(req, res){
	var user = UserHandler.getUserFromSession.fromReq( req )
		;

	ImageHandler.uploadImage(user, req).then(function(data){
		return {
			data: [data]
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});

// 编辑器 demo API
web.get('/code/demo/',      function(req, res){
	res.end();
});
web.post('/code/demo/',     function(req, res){
	var body        = req.body
		, html      = body.html
		, css       = body.css
		, cssLib    = body.cssLib
		, js        = body.js
		, jsLib     = body.jsLib
		;

	// todo 处理 html 相关
	// todo 处理 css 相关
	// todo 处理 js 相关

	res.send('<!DOCTYPE html>' +
		'<html lang="cmn">' +
			'<head>' +
				'<meta charset="UTF-8"/>' +
				'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>' +
				'<title>前端代码运行结果</title>' +
				(cssLib ? cssLib.split(',').map(function(d){
					return '<link rel="stylesheet" href="../lib/'+ d +'"/>';
				}).join('') : '') +
				'<style>' +	css + '</style>' +
			'</head>' +
			'<body>' +
				html +
				(jsLib ? jsLib.split(',').map(function(d){
					return '<script src="../lib/'+ d +'"></script>';
				}).join('') : '') +
				'<script>' + js + '</script>' +
			'</body>' +
		'</html>');
	res.end();
});
web.get('/code/demo/get',   function(req, res){
	var query = req.query
		;

	res.send( JSON.stringify(query) );
	res.end();
});
web.post('/code/demo/set',  function(req, res){
	var body = req.body
		;

	res.send( JSON.stringify(body) );
	res.end();
});

socket.register({
	code: function(socket, data){
		var topic = 'code'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		CodeHandler.getCodeList(user, query).then(function(data){
			return {
				topic: topic
				, data: data
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, 'code/search': function(socket, data){
		var topic = 'code/search'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		CodeHandler.getCodeList(user, query).then(function(data){
			return {
				topic: topic
				, data: data
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, 'code/filter': function(socket, data){
		var topic = 'code/search'
			, query = data.query || {}
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		CodeHandler.getCodeList(user, query).then(function(data){
			return {
				topic: topic
				, data: data
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, 'code/code': function(socket, data){}
	, 'code/editor/save': function(socket, data){
		var topic = 'code/editor/save'
			, query = data.query
			, user = UserHandler.getUserFromSession.fromSocket(socket)
			;

		CodeHandler.saveCode(user, query).then(function(data){
			return {
				topic: topic
				, data: [data]
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
	, 'code/lib': function(socket){
		LibModel.getBowerAll().then(function(rs){
			socket.emit('data', {
				topic: 'code/lib'
				, data: rs
			});
		});
	}
	, 'code/demoImgLib': function(socket){
		var topic = 'code/demoImgLib'
			, user = UserHandler.getUserFromSession.fromSocket( socket )
			;

		ImageHandler.getImageList(user, {
			albumId: ImageHandler.ALBUM.demo
		}).then(function(data){
			return {
				topic: topic
				, data: data
				, msg: 'Done'
			};
		}, function(e){
			console.log( e );

			return {
				topic: topic
				, msg: e.message
			};
		}).then(function(json){
			socket.emit('data', json);
		});
	}
});