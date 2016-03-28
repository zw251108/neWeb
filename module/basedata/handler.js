'use strict';

var BaseDataModel = require('./model.js')
	, BaseDataError   = require('./error.js')

	, Default_Country_ID = 1
	, BaseDataHandler = {
		getProvince: function(country){
			return BaseDataModel.province();
		}
		, getCity: function(province){

		}
		, getDistrict: function(city){

		}
		, getTown: function(district){

		}
		, getVillage: function(town){

		}
		, getUniversity: function(province){

		}
	}
	;

module.exports = BaseDataHandler;