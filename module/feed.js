'use strict';

var Feed = {
		index: {
			sql: 'select * from rss'
		}
	}
	, tpl = require('./tpl.js')
	, emmetTpl = require('./emmetTpl/emmetTpl.js').template
	, segment = require('./segment/segment.js')

	, feedTpl = emmetTpl({
		template: 'section.rss_section.section>a[href=%html_href% data-rss=%xml_url%]>h3.section_title{%name%}>span.icon.icon-minus^dl{%dl%}'
	})
	, dlTpl = emmetTpl({
		template: ''
	})
	;

module.exports = function(web, db, socket, metro){
	var feed = Feed;

	metro.push({
		id: 'rss'
		, type: 'metro'
		, size: 'normal'
		, title: '订阅 rss'
	});

	web.get('/rss/', function(req, res){
		var index = feed.index;

		db.query(index.sql, function(e, rs){
			if( !e ){
				res.send()
			}
			else{
				console.log('\n', 'db', '\n', index.sql, '\n', e.message);
			}
			res.end();
		});
	});

	socket.register({
		rss: function(socket){

		}
		, 'rss/list': function(socket){

		}
	});
};