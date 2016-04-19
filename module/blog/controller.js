'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')

	, config    = require('../../config.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, BlogError = require('./error.js')
	, BlogView  = require('./view.js')
	, BlogAdminView = require('./admin.view.js')
	, BlogHandler   = require('./handler.js')

	, UserHandler   = require('../user/handler.js')
	;

modules.register({
	id: 'blog'
	, metroSize: 'tiny'
	, title: '博客 blog'
	, icon: 'edit'
	, href: 'blog/'
});

menu.register({
	id: 'blog'
	, title: '博客 blog'
	, icon: 'edit'
	, href: 'blog/'
});

web.get('/blog/', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq(req)
		;
	console.log(user)
	BlogHandler.getBlogList(user, query).then(BlogView.blogList, function(e){
		console.log( e );
		// todo 错误页面
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/blog/:blogId/', function(req, res){
	var param = req.params || {}
		, user = UserHandler.getUserFromSession.fromReq(req)
		;

	BlogHandler.getBlog(user, param).then(BlogView.blog, function(e){
		console.log( e );

		// todo 错误页面
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

/**
 *
 * */
admin.register({
	id: 'blog'
	, metroSize: 'tiny'
	, title: '博客 blog'
	, icon: 'edit'
	, href: 'blog/'
});
web.get('/admin/blog/', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	BlogHandler.getBlogList(user, query).then(BlogAdminView.blogList, function(e){
		console.log( e );
		// todo 错误页面
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/admin/blog/:blogId/', function(req, res){
	var param = req.params || {}
		, user = UserHandler.getUserFromSession.fromReq(req)
		;

	BlogHandler.getBlog(user, param).then(BlogAdminView.blog, function(e){
		console.log( e );

		// todo 错误页面
	}).then(function(html){
		// todo 页面其它部分

		return html;
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

/**
 * post /admin/blog/         新建文章
 * post /admin/blog/:blogId/ 保存文章内容
 * */
web.post('/admin/blog/', function(req, res){
	var body = req.body || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	BlogHandler.newBlog(user, body).then(function(rs){
		return {
			info: rs
		};
	}, function(e){
		console.log( e );

		return {
			error: ''
			, msg: e.message
		}
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});
web.post('/admin/blog/:blogId/', function(req, res){
	var body = req.body || {}
		, param = req.params || {}
		, user = UserHandler.getUserFromSession.fromReq( req )
		;

	body.blogId = param.blogId;

	BlogHandler.saveBlog(user, body).then(function(rs){
		return {
			info: rs
		};
	}, function(e){
		console.log( e );

		return {
			error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
});