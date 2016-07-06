'use strict';

var CONFIG = require('../../config.js')
	, getSize   = require('image-size')
	, multer    = require('multer')

	, dirList = {
		demo: 'demo/'
	}
	, albumList = {
		preview: 2
		, avatar: 3
		, ugc: 4
		, demo: 5
	}
	, DEFAULT_ALBUM_ID = 1

	// 中间件
	, uploadMiddleware  = multer({
		storage: multer.diskStorage({
			destination: function(req, file, callback){
				var body = req.body || {}
					, type = body.type
					;

				callback(null, CONFIG.web.uploadDir + (type in dirList ? dirList[type] : 'upload/'));
			}
			, filename: function(req, file, callback){
				callback(null, file.originalname);
			}
		})
	})

	, UserHandler   = require('../user/handler.js')

	, ImageModel = require('./model.js')
	, ImageError = require('./error.js')
	, ImageHandler = {
		// 错误处理
		getError: function(msg){
			return Promise.reject( new ImageError(msg) );
		}

		// 相册列表
		, ALBUM: albumList
		, DEFAULT_ALBUM_ID: DEFAULT_ALBUM_ID

		// 获取文件宽高尺寸
		, getSize: getSize

		// 文件上传中间件
		, uploadMiddleware: uploadMiddleware

		, getImageList: function(user, query){
			var execute
				, albumId = query.albumId
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				if( albumId ){
					execute = ImageModel.getImageByAlbum( albumId ).then(function(rs){

					});
				}
				else{

				}

			}

			return execute;
		}
		, getImage: function(user, query){

			return ImageModel
		}

		, uploadImage: function(user, req){
			var body = req.body || {}
				, file = req.file
				, type
				, size
				, imgData
				, execute
				;

			// todo 判断用户权限
			if( file ){
				type = body.type;
				size = ImageHandler.getSize( req.file.path );
				imgData = {
					src: file.path.replace(/\\/g, '/').replace('public', '..')
					, type: type in albumList ? albumList[type] : DEFAULT_ALBUM_ID
					, height: size.height
					, width: size.width
				};

				execute = ImageHandler.newImage(user, imgData);
			}
			else{
				execute = ImageHandler.getError('没有文件上传');
			}
			return execute;
		}

		, newImage: function(user, data){
			var execute
				, isGuest = UserHandler.isGuest( user )
				;

			if( isGuest ){
				execute = UserHandler.getError('用户尚未登录');
			}
			else{
				execute = ImageModel.addImage( data ).then(function(rs){
					var result
						;

					if( rs && rs.insertId ){
						data.id = rs.insertId;
						result = data;
					}
					else{
						result = ImageHandler.getError('图片已存在');
					}

					return result;
				});
			}

			return execute;
		}

		, getAlbum: function(user, query){

		}
	}
	;

module.exports = ImageHandler;