'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')

	, config    = require('../../config.js')

	, modules   = require('../module.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')
	, menu      = require('../menu.js')

	, UserError = require('./error.js')
	, UserView      = require('./view.js')
	, UserAdminView = require('./admin.view.js')
	, UserHandler   = require('./handler.js')
	;

modules.register({
	//id: 'user'
	//, metroSize: 'tiny'
	//, title: '用户中心 user'
	//, icon: 'user'
	//, href: 'user/'
	//, hrefTitle: '用户中心'
//}, {
	id: 'resume'
	, metroSize: 'tiny'
	, title: '简历 resume'
	, icon: 'user'
	, href: 'user/resume'
	, hrefTitle: '个人简历'
});

menu.register({
//	id: 'user'
//	, title: '用户 user'
//	, icon: 'user'
//	, href: 'user/'
//}, {
	id: 'resume'
	, title: '简历 resume'
	, icon: 'user'
	, href: 'user/resume'
});

web.get('/user/', function(req, res){
	var query = req.query || {}
		, user = UserHandler.getUserFromSession.fromReq(req)
		;

	// todo 用户首页
	res.end();
});

/**
 * 用户登录相关
 * */
web.get('/user/login', function(req, res){
	// todo 用户登录页面

	res.end();
});
web.post('/user/login', function(req, res){
	// 用户登录
	var query = req.body
		, session = req.session
		, user = session.user || {}
		;

	UserHandler.userLogin( query ).then(function(rs){
		// 将 user 放入 session
		user.id = rs.id;
		req.session.user = user;

		return {
			info: rs
		};
	}, function(e){
		console.log( e );

		return {
			error: ''
			, msg: e.message
		};
	}).then(function(send){
		res.send( JSON.stringify(send) );
		res.end();
	});
});
web.post('/user/avatar', function(req, res){
	var query = req.body || {}
		;

	UserHandler.getUserAvatar( query ).then(function(rs){
		return {
			info: rs
		};
	}, function(e){
		console.log( e );

		return {
			error: ''
			, msg: e.message
		};
	}).then(function(send){
		res.send( JSON.stringify(send) );
		res.end();
	});
});

/**
 * resume 个人简历
 * */
web.get('/user/resume', function(req, res){
	Promise.resolve( UserView.resume() ).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});
/**
 * resume 个人简历 各个项目数据
 * */
web.get('/user/resume/skill', function(req, res){
	res.send([{
		value: 9, title: 'HTML(5) & CSS(3)'}, {
		value: 8, title: 'JavaScript'}, {
		value: 7, title: '库 & 框架'}, {
		value: 7, title: 'Node.js & 前端工具'}, {
		value: 2, title: '设计审美'}, {
		value: 6, title: '用户体验'
	}]);
	res.end();
});
web.get('/user/resume/basicData', function(req, res){
	res.send([{
		value: 8, title: '团队协作'}, {
		value: 9, title: '学习能力'}, {
		value: 7, title: '创意'}, {
		value: 6, title: '责任心'}, {
		value: 5, title: '沟通能力'}, {
		value: 8, title: '视野'
	}]);
	res.end();
});
web.get('/user/resume/workHistory', function(req, res){
	res.send([{
		start: '2016-04'
		, co: {
			name: '大连大商天狗电子商务有限公司'
			, href: ''
		}
		, job: {
			title: 'Web 前端工程师'
			, desc: ''
		}
	}, {
		start: '2015-03'
		, end: '2016-02'
		, co: {
			name: '如是科技（大连）有限公司'
			, href: ''
		}
		, job: {
			title: 'Web 前端工程师'
			, desc: ''
		}
	}, {
		start: '2014-11'
		, end: '2015-03'
		, co: {
			name: '天向企业'
			, href: ''
		}
		, job: {
			title: 'Web 前端工程师'
			, desc: ''
		}
	}, {
		start: '2013-04'
		, end: '2014-09'
		, co: {
			name: '德辉科技（大连）有限公司'
			, href: ''
		}
		, job: {
			title: 'Web 前端工程师'
			, desc: ''
		}
	}, {
		start: '2012-04'
		, end: '2013-04'
		, co: {
			name: '中科海云网络科技（大连）有限公司'
			, href: ''
		}
		, job: {
			title: 'Web 前端工程师'
			, desc: ''
		}
	}, {
		start: '2009-10'
		, end: '2012-03'
		, co: {
			name: '大连网景科技有限公司'
			, href: ''
		}
		, job: {
			title: 'PHP 开发工程师'
			, desc: ''
		}
	}]);
	res.end();
});
web.get('/user/resume/tags', function(req, res){
	res.send([
		'游戏宅'
		, '伪·技术宅'
		, '程序员'
		, '兼职·段子手'
		, '自黑爱好者'
		, '吐槽狂'
		, '腹黑'
		, '社交冷漠'
		, '情商低下'
		, '80后'
		, '悲观主义'
		, '负能量'
		, '没心没肺'
		, '吃货'
		, '肉食动物'
		, '天蝎座'
	]);
	res.end();
});


socket.register({
	'user/skin': function(socket, data){
		var user = UserHandler.getUserFromSession.fromSocket( socket )
			, query = data.query || {}
			;
		//console.log(socket)

		//session.reload(function(){
		//	user.skin = skin;
		//	session.user = user;
		//});

		user.skin = query.skin || 'default';

		//socket.emit('data', {
		//	topic: 'user/skin'
		//	, info: {
		//		skin: skin
		//	}
		//});
	}
});