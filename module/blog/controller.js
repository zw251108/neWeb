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
	//, Handler = require('./handler.js')(data)
	, BlogError = require('./error.js')
	;


//web.use('/script/module/blog.js', __dirname +'/module/blog/handler.js');

//index.push({
//
//});


web.get('/blog/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getBlogByPage(page, size).then(function(rs){
		return Model.countBlog().then(function(count){
			return {
				data: rs
				, index: page
				, size: size
				, count: count
				, urlCallback: function(index){
					return '?page='+ index;
				}
			}
		})
	}).then( View.blogList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

web.get('/blog/detail', function(req, res){
	var query = req.query || {}
		, id = query.id
		;
	if( id ){
		Model.getBlogById( id ).then( View.blog ).then(function(html){
			res.send( config.docType.html5 + html );
			res.end();
		});
	}
	else{

	}
});


/**
 *
 * */
web.get('/admin/blog/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getBlogByPage(page, size).then(function(rs){
		return Model.countBlog().then(function(count){
			return {
				data: rs
				, count: count
				, index: page
				, size: size
				, urlCallback: function(index){
					return '?page='+ index;
				}
			}
		});
	}).then( Admin.blogList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
web.get('/admin/blog/:blogId/', function(req, res, next){
	var param = req.params || {}
		, blogId = param.blogId
		;

	if( blogId && /^\d+$/.test( blogId ) ){
		Model.getBlogById( blogId).then( Admin.blog ).then(function(html){
			res.send( config.docType.html5 + html );
			res.end();
		});
	}
	else{
		next();
	}
});

/**
 * /admin/blog/add              新建文章
 * /admin/blog/:blogId/save     保存文章内容
 * */
web.post('/admin/blog/add', function(req, res){
	var body = req.body || {}
		, title = body.title
		;
	console.log(req.session);
	if( title ){
		Model.addBlog(req.session.user.id, title).then(function(rs){
			var json = {}
				;

			if( rs.insertId ){
				json.success = true;
				json.id = rs.insertId;
			}
			else{
				json.success = false;
			}

			res.send( JSON.stringify(json) );
			res.end();
		});
	}
	else{
		res.send( JSON.stringify({
			success: false
			, error: ''
			, msg: '缺少标题'
		}) );
		res.end();
	}
});
web.post('/admin/blog/:blogId/save', function(req, res){
	var body = req.body || {}
		, title = body.title
		, content = body.content
		, param = req.params || {}
		, blogId = param.blogId
		;
	Model.updateBlog(title, content, '', blogId).then(function(rs){
		var json = {
			success: true
		};

		res.send( JSON.stringify(json) );
		res.end();
	}, function(e){

	});
});

admin.push('blog');