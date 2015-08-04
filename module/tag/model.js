'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, SQL   = {
		tag: 'select name,num from tag order by num'
		, tagLink: 'select * from tag'
		, tagAdd: 'insert into tag(name) select :name from dual where not exists (select * from tag where name like :name)'
		, tagIncrease: 'update tag set num=num+:increase where name=:name'
		, tagIsExist: 'select * from tag where name=:name'
	}
	, Model = {
		tag: function(){
			return db.handle({
				sql: SQL.tag
			});
		}
		, tagAdd: function(name){
			return db.handle({
				sql: SQL.tagAdd
				, data: {
					name: name
				}
			});
		}
		, tagIncrease: function(name, num){
			return db.handle({
				sql: SQL.tagIncrease
				, data: {
					name: name
					, num: num
				}
			});
		}
		, tagIsExist: function(name){
			return db.handle({
				sql: SQL.tagIsExist
				, data: {
					name: name
				}
			}).then(function(rs){
				return !!(rs && rs.length);
			});
		}
	}
	;

module.exports = Model;