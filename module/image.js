'use strict';

var db          = require('./db/db.js')
	, web       = require('./web/web.js')
	, socket    = require('./socket/socket.js')
	, error     = require('./error/error.js')

	, tpl       = require('./emmetTpl/tpl.js')
	, emmetTpl  = require('./emmetTpl/emmetTpl.js').template

	, CONFIG    = require('../config.js')

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

	/**
	 * @namespace   Image
	 * */
	, Image = {
		/**
		 * @namespace   Model
		 * @memberof    Image
		 * @desc    业务相关 sql 语句集合
		 * */
		Model: {
			image: 'select * form image'
			, imagePage: 'select * form image limit :page,:size'
			, imageByAlbum: 'select src,width,height from image where album_id=:albumId'
			, imageAdd: 'insert into image(src,width,height,album_id) select :src,:width,:height,:type from dual where not exists(select * from image where src like :src)'
		}

		/**
		 * @namespace   Handler
		 * @memberof    Image
		 * @desc    数据处理方法集合
		 * */
		, Handler: {}

		/**
		 * @namespace   View
		 * @memberof    Image
		 * @desc    视图模板集合
		 * */
		, View: {

		}

		, uploadMiddle: upload
		, sizeOf: sizeOf
	}
	;

// 单个文件上传接口
web.post('/image/imageUpload', upload.single('image'), function(req, res){
	var body = req.body || {}
		, type = body.type
		, file = req.file
		, size = sizeOf ( req.file.path )
		;

	db.handle({
		sql: Image.Model.imageAdd
		, data: {}
	}).then(function(rs){
		var data = rs.data;

		rs = rs.result;

		data.Id = rs.insertId;

		res.send( JSON.stringify(data) );
		res.end();
	});
});
// 多个文件上传接口
web.post('/image/imagesUpload', upload.array(), function(req, res){
	var body = req.body || {}
		, type = body.type
});

//web.post('/image/demoUpload', upload.single('image'), function(req, res){
//	var body = req.body || {}
//		, type = body.type
//		, file = req.file
//		, size = sizeOf( req.file.path )
//		;
//
//	db.handle({
//		sql: Image.Model.imageAdd
//		, data: {
//			height: size.height
//			, width: size.width
//			, src: file.path.replace(/\\/g, '/').replace('public', '..')
//			, type: type === 'demo' ? 5 : 1
//		}
//	}).then(function(rs){
//		var data = rs.data;
//
//		rs = rs.result;
//
//		data.Id = rs.insertId;
//
//		res.send( JSON.stringify(data) );
//		res.end();
//	})
//});

web.get('/data/image', function(req, res){});

web.get('/admin/image', function(req, res){

});

socket.register({
	image: function(socket, data){}
});

module.exports = Image;