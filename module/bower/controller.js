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
	, BowerError    = require('./error.js')
	;

// 注册首页 metro 模块
index.push({
	id: 'bower'
	, type: 'metro'
	, size: 'normal'
	, title: '组件 bower'
});

web.get('/bower/', function(req, res){
	var query = req.query || {}
		, page = query.page || 1
		, size = query.size || 20
		;

	Model.getBowerByPage(page, size).then(function(rs){
		return Model.countBower().then(function(count){
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
	}).then( View.bowerList ).catch(function(){console.log(arguments)}).then(function(html){
		res.send( config.docType.html5 + html );
		res.end();
	});
});

socket.register({
	bower: function(socket, data){}
	, 'bower/editor/lib': function(socket, data){}

	, 'bower/search': function(socket, data){
		var query = data.query || {}
			, name = query.name
			;

		if( name ){

		}
	}
	, 'bower/install': function(socket, data){

	}
	, 'bower/install/endChoose': function(socket, data){

	}
	, 'bower/install/prompts': function(socket, data){

	}
});