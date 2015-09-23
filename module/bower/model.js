'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, Promise   = require('promise')

	, BowerError    = require('./error.js')

	, TABLE_NAME    = 'ui_lib'

	, SQL = {
		bower: 'select * from '+ TABLE_NAME +' where status=\'1\''
		, bowerByPage: 'select * from '+ TABLE_NAME +' limit :page,:size'

		, bowerCount: 'select count(*) as count from'+ TABLE_NAME
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
	}
	;

module.exports = Model;