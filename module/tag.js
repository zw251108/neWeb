'use strict';

var Tag = {
		all: {
			sql:'select Id,name,num,description as desc form tag'
		}
		, getById: {
			sql: ''
		}
		, add: {
			sql: ''
		}
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