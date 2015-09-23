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

	, LibModel = require('../bower/model.js')
	, ImageModel = require('../image/model.js')

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

	Model.getEditorByPage(page, size).then(function(rs){
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
	}).then( View.editorList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/editor/code', function(req, res){
	var query = req.query || {}
		, id = query.id
		, response
		;

	if( id !== '0' ){
		response = Model.getEditorById(id);
	}
	else{
		response = Promise.resolve({
			Id: 0
			, js_lib: 'jquery/dist/jquery.js'
		});
	}

	response.then( View.editor ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/editor/result', function(req, res){
	res.end();
});

socket.register({
	editor: function(socket, data){
		var query = data.query || {}
			, page = query.page || 1
			, size = query.size || 20
			;

		Model.getEditorList(page, size).then(function(rs){
			socket.emit('data', {
				topic: 'editor'
				, data: rs
			});
		});
	}
	, 'editor/code': function(socket, data){}
	, 'editor/code/save': function(socket, data){
		var query = data.query
			, id = query.id || ''
			, rs
			;

		if( id !== '0' ){
			rs = Model.updateEditor(query);
		}
		else{
			rs = Model.addEditor(query);
		}

		rs.then(function(rs){
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

		ImageModel.getImageByAlbum(5).then(function(rs){

			socket.emit('data', {
				topic: 'editor/demoImgLib'
				, data: rs
			});
		});
	}
});