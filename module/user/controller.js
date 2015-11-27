/**
 *
 * */

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model     = require('./model.js')
	, View      = require('./view.js')
	, Admin
	, User      = require('./user.js')
	, UserError = require('./error.js')

	, Promise   = require('promise')
	;

//modules.register({
//	id: 'user'
//	, metroSize: 'tiny'
//	, title: '用户中心 user'
//	, icon: 'user'
//	, href: 'user/'
//	, hrefTitle: '用户中心'
//});

web.get('/user/', function(req, res){
	// todo 用户首页
});
