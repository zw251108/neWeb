'use strict';

var CONFIG    = require('../../config.js')
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

	, db        = require('../db.js')
	, web       = require('../web.js')
	, socket    = require('../socket.js')

	, ImageView         = require('./view.js')
	, ImageAdminView    = require('./admin.view.js')
	, ImageHandler      = require('./handler.js')
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
		var data = {};//rs.data;

		//rs = rs.result;

		data.id = rs.insertId;

		res.send( JSON.stringify(data) );
		res.end();
	});
});
// 多个文件上传接口
web.post('/image/imagesUpload', upload.array(), function(req, res){
	var body = req.body || {}
		, type = body.type
		;
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
//		data.id = rs.insertId;
//
//		res.send( JSON.stringify(data) );
//		res.end();
//	})
//});

web.get('/admin/image', function(req, res){

});

socket.register({
	image: function(socket, data){}
});

web.get('/data/image', function(req, res){});