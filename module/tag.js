'use strict';

var Tag = {
		all: 'select Id,name,num,description as desc form tag'
		, getById: {
			sql: ''
		}
		, add: 'insert into tag(name,num,description) values(?,0,?)'
		, plus: 'update tag set num+=1 where Id=?'
		, change: 'update tag set name=?,description=? where Id=?'
	}
	, tpl = require('./emmetTpl/tpl.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, tagArea = emmetTpl({
		template: 'div.tags'
	})
	, tagTpl = emmetTpl({
		template: 'span.tag[data-tag-id=%tagId%]{tagName}'
	})
	;


module.exports = function(web, db, socket, metro){
	var editor = Tag;

	socket.register({
	    'tag': function(){

	    }
		, 'tag/add': function(){

		}
	});
};