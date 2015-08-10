'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, SQL   = {
		tag: 'select name,num from tag order by num'
		, tagAll: 'select * from tag'
		, tagAdd: 'insert into tag(name) select :name from dual where not exists (select * from tag where name like :name)'
		, tagIncrease: 'update tag set num=num+:increase where name=:name'
		, tagIsExist: 'select * from tag where name=:name'
	}
	, Model = {
		getAll: function(){
			return db.handle({
				sql: SQL.tagAll
			});
		}
		, add: function(name){
			return db.handle({
				sql: SQL.tagAdd
				, data: {
					name: name
				}
			});
		}
		, increaseByName: function(name, num){
			return db.handle({
				sql: SQL.tagIncrease
				, data: {
					name: name
					, num: num
				}
			});
		}
		, isExist: function(name){
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

db.handle({
	sql: SQL.tagAll
}).then(function(rs){
	var index = {}
		;

	rs.forEach(function(d, i){
		return index[d.name] = i;
	});

	Model.TAG_CACHE = rs;
	Model.TAG_INDEX = index;
});

module.exports = Model;