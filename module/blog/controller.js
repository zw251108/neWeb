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
		});
	}).then( View.blogList ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

web.get('/blog/detail', function(req, res){
	var query = req.query || {}
		, id = query.id
		, execute
		;
	if( id ){
		execute = Model.getBlogById( id ).then( View.blog );
	}
	else{
		execute = Promise.reject( new BlogError('缺少参数 id') );
	}

	execute.catch(function(e){
		console.log( e );

		return '';
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
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
web.get('/admin/blog/:blogId/', function(req, res){
	var param = req.params || {}
		, blogId = param.blogId
		, execute
		;

	if( blogId && /^\d+$/.test( blogId ) ){
		execute = Model.getBlogById( blogId).then( Admin.blog );
	}
	else{
		execute = Promise.reject( new BlogError('缺少参数 blogId') );
	}

	execute.catch(function(e){
		console.log( e );

		return '';
	}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	})
});

/**
 * /admin/blog/add              新建文章
 * /admin/blog/:blogId/save     保存文章内容
 * */
web.post('/admin/blog/add', function(req, res){
	var body = req.body || {}
		, title = body.title
		, execute
		;

	console.log(req.session);
	if( title ){
		execute = Model.addBlog(req.session.user.id, title).then(function(rs){
			var result
				;

			if( rs.insertId ){
				result = {
					success: true
					, id: rs.insertId
				};
			}
			else{
				result = Promise.reject( new BlogError(title + ' 文章创建失败') );
			}

			return result;
		});
	}
	else{
		execute = Promise.reject( new BlogError('缺少标题') );
	}

	execute.catch(function(e){
		console.log( e );

		return {
			success: false
			, error: ''
			, msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	})
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
	});
});

admin.push('blog');