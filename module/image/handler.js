'use strict';

var CONFIG = require('../../config.js')

	, multer    = require('multer')

	, ImageModel = require('./model.js')
	, ImageError = require('./error.js')
	, ImageHandler = {
		// 错误处理
		getError: function(msg){
			return Promise.reject( new ImageError(msg) );
		}

		// 获取文件宽高尺寸
		, getSizeOf: require('image-size')

		// 文件上传中间件
		, uploadMiddleware: multer({
			storage: multer.diskStorage({
				destination: function(req, file, cb){
					var body = req.body || {}
						, type = body.type
						, path
						;

					switch( type ){
						case 'demo':
							path = CONFIG.web.uploadDir +'demo/';
							break;
						default:
							path = CONFIG.web.uploadDir +'upload/';
							break;
					}

					cb(null, path);
				}
				, filename: function(req, file, cb){
					cb(null, file.originalname);
				}
			})
		})

		, getImageList: function(user, query){}
		, getImage: function(user, query){

			return ImageModel
		}

		, newImage: function(user, data){

		}
	}
	;

module.exports = ImageHandler;