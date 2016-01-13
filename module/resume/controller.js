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

web.get('/resume/skill', function(req, res){
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
web.get('/resume/basicData', function(req, res){
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
web.get('/resume/workHistory', function(req, res){
	res.send([{
		start: '2015-03'
		, co: {
			name: '大连面视科技有限公司'
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
web.get('/resume/tags', function(req, res){
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

//admin.push('resume');