'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, Promise   = require('promise')

	, ImageError = require('./error.js')

	, TABLE_NAME = 'image'
	, SQL = {
		imageByPage: 'select * from image limit :page,:size'
		, imageByAlbum: 'select src,width,height from '+ TABLE_NAME +' where album_id=:albumId'
		, imageAdd: 'insert into image(src,width,height,album_id) select :src,:width,:height,:type from dual' +
			' where not exists(select * from image where src like :src)'
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
		, addImage: function(data){
			return db.handle({
				sql: SQL.imageAdd
				, data: data
			});
		}
	}
	;

module.exports = Model;