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
	, ResumeError  = require('./error.js')

	, Promise = require('promise')
	;

modules.register({
	id: 'resume'
	, metroSize: 'tiny'
	, title: '简历 resume'
	, icon: 'user'
	, href: 'resume/'
	, hrefTitle: '个人简历'
});

web.get('/resume/', function(req, res){
	Promise.resolve( View.resume() ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

admin.push('resume');