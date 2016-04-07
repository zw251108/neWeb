'use strict';

var BaseDataModel = require('./model.js')
	, BaseDataError   = require('./error.js')

	, Default_Country_ID = 1
	, BaseDataHandler = {
		getProvince: function(country){
			return BaseDataModel.province();
		}
		, getCity: function(province){
			var provinceCode = province.code
				, execute
				;

			if( provinceCode ){
				execute = BaseDataModel.city( provinceCode );
			}
			else{
				execute = Promise.reject( new BaseDataError('缺少参数 provinceCode') );
			}

			return execute;
		}
		, getDistrict: function(city){
			var cityCode = city.code
				, execute
				;

			if( cityCode ){
				execute = BaseDataModel.district( cityCode );
			}
			else{
				execute = Promise.reject( new BaseDataError('缺少参数 cityCode') );
			}

			return execute;
		}
		, getTown: function(district){
			var districtCode = district.code
				, execute
				;

			if( districtCode ){
				execute = BaseDataModel.town( districtCode );
			}
			else{
				execute = Promise.reject( new BaseDataError('缺少参数 districtCode') );
			}

			return execute;
		}
		, getVillage: function(town){
			var townCode = town.code
				, execute
				;

			if( townCode ){
				execute = BaseDataModel.village( townCode );
			}
			else{
				execute = Promise.reject( new BaseDataError('缺少参数 townCode') );
			}

			return execute;
		}
		, getUniversity: function(province){
			var provinceCode = province.code
				, execute
				;

			if( provinceCode ){
				execute = BaseDataModel.university( provinceCode );
			}
			else{
				execute = Promise.reject( new BaseDataError('缺少参数 provinceCode') );
			}

			return execute;
		}
	}
	;

module.exports = BaseDataHandler;