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
	, Handler = require('./handler.js')(data)

	;


//web.use('/script/module/blog.js', __dirname +'/module/blog/handler.js');

//index.push({
//
//});


web.get('/blog/', function(req, res){

	//Handler.getList().then( View.blogList ).then(function( html ){
	//	res.send( config.docType.html5 + html );
	//	res.end();
	//});
});

web.get('/blog/detail', function(req, res){
	var callback
		;

	// 判断是否为 ajax
	if( req.xhr ){
		callback = req.query.callback;
	}
	else{

	}
});


web.get('/admin/blog/', function(req, res){
	Model.getBlogList(1, 20).then( Admin.list).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/admin/blog/:blogId/', function(req, res){
	var blogId = req.params.blogId;
	Model.getContentById( blogId).then( Admin.article ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

admin.push('blog');