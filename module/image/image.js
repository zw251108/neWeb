'use strict';

var config  = require('../../config.js')

	, ImageError = require('./error.js')

	, sizeOf    = require('image-size')
	, multer    = require('multer')
	, ALBUM_TYPE    = {
		demo: 'demo/'
	}
	, upload    = multer({
		storage: multer.diskStorage({
			destination: function(req, file, next){
				var body = req.body || {}
					, type = body.type
					, path
					;

				path = config.web.uploadDir + (ALBUM_TYPE[type] || 'upload/');

				next(null, path);
			}
			, filename: function(req, file, next){
				next(null, file.originalname);
			}
		})
	})

	, Image = {
		uploadMiddle: upload
		, sizeOf: sizeOf
		, ALBUM: {
			DEFAULT_ID: 1
			, EDITOR_PREVIEW_ID: 2
			, EDITOR_DEMO_ID: 5
			, AVATAR_ID: 3
			, UGC_ID: 4
		}
	}
	;

module.exports = Image;