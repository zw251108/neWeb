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

	;

// 注册首页 metro 模块
index.push({
	id: 'document'
	, type: 'metro'
	, size: 'small'
	, title: '前端文档 document'
});

web.get('/document/', function(req, res){

	Model.getAll().then( View.document ).then(function( html ){
		res.send( config.docType.html5 + html );
		res.end();
	});
});