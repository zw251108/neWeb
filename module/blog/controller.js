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
	//, Handler = require('./handler.js')(data)
	, BlogError = require('./error.js')

	, User  = require('../user/user.js')

	, Promise = require('promise')
	;

//web.use('/script/module/blog.js', __dirname +'/module/blog/handler.js');

modules.register({
	id: 'blog'
	, metroSize: 'tiny'
	, title: '博客 blog'
	, icon: 'edit'
	, href: 'blog/'
});
web.get('/blog/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		, user = User.getUserFromSession.fromReq(req)
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
web.get('/blog/:blogId/', function(req, res){
	var param = req.params || {}
		, blogId = param.blogId
		, user = User.getUserFromSession.fromReq(req)
		, execute
		;
	if( blogId ){
		execute = Model.getBlogById( blogId ).then( View.blog );
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
admin.register({
	id: 'blog'
	, metroSize: 'tiny'
	, title: '博客 blog'
	, icon: 'edit'
	, href: 'blog/'
});//push('blog');
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
 * post /admin/blog/         新建文章
 * post /admin/blog/:blogId/ 保存文章内容
 * */
web.post('/admin/blog/', function(req, res){
	var body = req.body || {}
		, title = body.title
		, user = User.getUserFromSession.fromReq(req)
		, execute
		;

	console.log(req.session);
	if( title ){
		execute = Model.addBlog(user.id, title).then(function(rs){
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
web.post('/admin/blog/:blogId/', function(req, res){
	var body = req.body || {}
		, title = body.title
		, content = body.content
		, tags = body.tags
		, param = req.params || {}
		, blogId = param.blogId
		;

	Model.updateBlog(title, content, tags, blogId).then(function(){
		var json = {
			success: true
		};

		res.send( JSON.stringify(json) );
		res.end();
	});
});