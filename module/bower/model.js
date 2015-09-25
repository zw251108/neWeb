'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, Promise   = require('promise')

	, BowerError    = require('./error.js')

	, TABLE_NAME    = 'ui_lib'

	, SQL = {
		bower: 'select * from '+ TABLE_NAME +' where status=\'1\''
		, bowerByPage: 'select * from '+ TABLE_NAME +' limit :page,:size'

		, bowerCount: 'select count(*) as count from '+ TABLE_NAME

		, bowerIsExist: 'select * from '+ TABLE_NAME +' where name like :name'

		, bowerAdd: 'insert into '+ TABLE_NAME +'(name,version,css_path,js_path,source,homepage,tags,receipt_time) values(:name,:version,:css_path,:js_path,:source,:homepage,:tags,now())'
	}

	, Model = {
		getBowerAll: function(){
			return db.handle({
				sql: SQL.bower
			});
		}
		, getBowerByPage: function(page, size){
			return db.handle({
				sql: SQL.bowerByPage
				, data: {
					page: (page -1) * size
					, size: size
				}
			});
		}

		, countBower: function(){
			return db.handle({
				sql: SQL.bowerCount
			}).then(function(rs){
				var count = 0;

				if( rs && rs.length ){
					count = rs[0].count;
				}

				return count;
			});
		}

		, isExistBower: function(name){
			return db.handle({
				sql: SQL.bowerIsExist
				, data: {
					name: name
				}
			}).then(function(rs){
				var is = false;

				if( rs && rs.length ){
					rs = ture;
				}

				return is;
			});
		}

		, addBower: function(data){
			return db.handle({
				sql: SQL.bowerAdd
				, data: data
			});
		}
	}
	;

module.exports = Model;