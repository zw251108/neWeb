'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, SQL   = {
		province:   'select * from basedata_add_province'
		, city:     'select * from basedata_add_city where province=:province'
		, district: 'select * from basedata_add_district where city=:city'
		, town:     'select * from basedata_add_town where district=:district'
		, village:  'select * from basedata_add_village where town=:town'

		, university:   'select * from basedata_edu_university where province=:province'
	}
	, BaseDataModel = {
		province: function(){
			return db.handle({
				sql: SQL.province
			});
		}
		, city: function(province){
			return db.handle({
				sql: SQL.city
				, data: {
					province: province
				}
			});
		}
		, district: function(city){
			return db.handle({
				sql: SQL.district
				, data: {
					city: city
				}
			});
		}
		, town: function(district){
			return db.handle({
				sql: SQL.town
				, data: {
					district: district
				}
			});
		}
		, village: function(town){
			return db.handle({
				sql: SQL.village
				, data: {
					town: town
				}
			});
		}

		, university: function(province){
			return db.handle({
				sql: SQL.university
				, data: {
					province: province
				}
			});
		}
	}
	;

/**
 * 服务器端 数据接口
 * */
module.exports = BaseDataModel;