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
	, ProfileError  = require('./error.js')

	, Promise = require('promise')
	;

// 注册首页 metro 模块
//index.push({
//
//});

web.get('/profile/', function(req, res){
	Promise.resolve( View.profile() ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

admin.push('profile');