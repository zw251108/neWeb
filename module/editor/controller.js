'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config')

	, index     = require('../index.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')

	, EditorError   = require('./error.js')
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

	Model.getEditorList(page, size).then(function(rs){
		return Model.countEditor().then(function(count){
			return {
				data: rs
				, index: page
				, size: size
				, count: count
			};
		});
	}).then( View.editor ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/editor/code', function(req, res){
	var query = req.query || {}
		, id = query.id
		;
	if( id ){
		Model.getEditorById(id).then( View.editorEdit ).then(function(html){
			res.send( config.docType.html5 + html );
			res.end();
		});
	}
	else{

	}
});

socket.register({
	editor: function(socket, data){}
	, 'editor/code': function(socket, data){}
	, 'editor/code/save': function(socket, data){

	}
	, 'editor/lib': function(socket, data){

	}
	, 'editor/demoImgLib': function(socket, data){

	}
});