'use strict';

var db          = require('./db/db.js')
	, error     = require('./error/error.js')
	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, tagArea = emmetTpl({
		template: 'div.tagArea'
	})
	, tagTpl = emmetTpl({
		template: 'span.tag[data-tag-id=%tagId%]{tagName}'
	})

	, Event     = require('events').EventEmitter
	, tag       = new Event()

	, TagModel  = {
		tag: 'select * from tag'
		, 'tag/add':{
			sql: 'insert into tag(name) select ? from dual where not exists (select * from tag where name like ?)'
			, handle: function(data, rs){
				var r;
				if( rs.insertId ){
					// todo
				}
				else{
					// todo 数据库已存在该数据
				}
			}
		}
		, 'tag/num': {
			sql: 'update tag set num=? where name=?'
			, handle: function(data, rs){
				var r;
				if( rs.changedRows ){
					// todo
				}
				else{
					// todo 数据不存在
				}
			}
		}
	}
	;

tag.on('data', function(topic, next, args, data){

});


module.exports = function(web, db, socket, metro){
	//var editor = Tag;
	//
	//socket.register({
	//    'tag': function(){
	//
	//    }
	//	, 'tag/add': function(){
	//
	//	}
	//});
};