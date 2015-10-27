'use strict';

var config  = require('../../config.js')

	, ImageError = require('./error.js')

	, sizeOf    = require('image-size')
	, multer    = require('multer')
	, upload    = multer({
		storage: multer.diskStorage({
			destination: function(req, file, cb){
				var body = req.body || {}
					, type = body.type
					, path
					;

				switch( type ){
					case 'demo':
						path = config.web.uploadDir +'demo/';
						break;
					default :
						path = config.web.uploadDir + 'upload/';
						break;
				}

				cb(null, path);
			}
			, filename: function(req, file, cb){
				cb(null, file.originalname);
			}
		})
	})

	, Image = {
		uploadMiddle: upload
		, sizeOf: sizeOf
	}
	;

module.exports = Image;