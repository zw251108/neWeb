'use strict';

var fs = require('fs')
	, Cheerio = require('cheerio')
	, Promise = require('promise')

	, config        = require('../../config.js')
	, db            = require('../db.js')
	, admin         = require('../admin.js')
	, tpl           = require('../emmet/tpl.js')
	, code          = require('../editor/model.js')

	, model         = require('./model.js')

	, View = {
		province: function(){
			return model.province().then(function(rs){

			});
		}
		, city: function( province ){
			var rs;

			if( province ){
				rs = model.city( province ).then(function(rs){

				});
			}
			else{
				rs = Promise.resolve([]);
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