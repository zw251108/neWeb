'use strict';

var Promise = require('promise')

	, config    = require('../../config.js')
	, db        = require('../db.js')
	, admin     = require('../admin.js')
	, tpl       = require('../emmet/tpl.js')

	, CodeModel = require('../editor/model.js')

	, Model         = require('./model.js')

	, View = {
		province: function(){
			return Model.province()
			//	.then(function(rs){
			//	return rs;
			//});
		}
		, city: function( province ){
			var rs;

			if( province ){
				rs = Model.city( province )
				//	.then(function(rs){
				//
				//});
			}
			else{
				rs = Promise.reject([]);
			}

			return rs;
		}
		, district: function( city ){}
		, town: function( town ){}
		, village: function( village ){}

		, university: function( university ){}
	}
	;

module.exports = View;