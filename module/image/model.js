'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, Promise   = require('promise')

	, ImageError = require('./error.js')

	, TABLE_NAME = 'image'
	, SQL = {
		imageByAlbum: 'select src,width,height from '+ TABLE_NAME +' where album_id=:albumId'
	}

	, Model = {
		getImageByAlbum: function(albumId){
			return db.handle({
				sql: SQL.imageByAlbum
				, data: {
					albumId: albumId
				}
			});
		}
	}
	;

module.exports = Model;