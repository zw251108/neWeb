'use strict';

var CONFIG = require('../../config.js')

	, UserHandler   = require('../user/handler.js')

	, BaseDataModel = require('./model.js')
	, BaseDataError = require('./error.js')
	, BaseDataHandler = {
		// 错误处理
		getError: function(msg){
			return Promise.reject( new BaseDataError(msg) );
		}

		, getProvince: function(user, query){
			var countryCode = query.code || CONFIG.params.COUNTRY_DEFAULT_CODE
				;

			// todo 用户权限判断，按国家查询
			return BaseDataModel.province( countryCode );
		}
		, getCity: function(user, query){
			var execute
				, provinceCode = query.code
				;

			// todo 用户权限判断
			if( provinceCode ){
				execute = BaseDataModel.city( provinceCode );
			}
			else{
				execute = BaseDataHandler.getError('缺少参数 provinceCode');
			}

			return execute;
		}
		, getDistrict: function(user, query){
			var execute
				, cityCode = query.code
				;

			// todo 用户权限判断
			if( cityCode ){
				execute = BaseDataModel.district( cityCode );
			}
			else{
				execute = BaseDataHandler.getError('缺少参数 cityCode');
			}

			return execute;
		}
		, getTown: function(user, query){
			var execute
				, districtCode = query.code
				;

			// todo 用户权限判断
			if( districtCode ){
				execute = BaseDataModel.town( districtCode );
			}
			else{
				execute = BaseDataHandler.getError('缺少参数 districtCode');
			}

			return execute;
		}
		, getVillage: function(user, query){
			var execute
				, townCode = query.code
				;

			// todo 用户权限判断
			if( townCode ){
				execute = BaseDataModel.village( townCode );
			}
			else{
				execute = BaseDataHandler.getError('缺少参数 townCode');
			}

			return execute;
		}
		, getUniversity: function(user, query){
			var execute
				, provinceCode = query.code
				;

			// todo 用户权限判断
			if( provinceCode ){
				execute = BaseDataModel.university( provinceCode );
			}
			else{
				execute = BaseDataHandler.getError('缺少参数 provinceCode');
			}

			return execute;
		}
	}
	;

module.exports = BaseDataHandler;