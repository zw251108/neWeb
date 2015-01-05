'use strict';

var tpl = require('./tpl.js')
	;

var SQL = {
		blog: {
			sql: 'select Id,title,datetime,tags_id,tags_name from blog where status=1 order by Id desc'
			, detail: {
				sql: 'select Id,content from blog where Id=?'
				, handler: function(rs){
					return rs[0];
				}
			}
		}
	}
	, init = function(db, socket){

	}
	;

exports.blog = init;