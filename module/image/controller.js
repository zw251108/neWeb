'use strict';

let CONFIG    = require('../../config.js')

	, db        = require('../db.js')
	, web       = require('../web.js')
	, socket    = require('../socket.js')

	, UserHandler   = require('../user/handler.js')

	, ImageView         = require('./view.js')
	, ImageAdminView    = require('./admin.view.js')
	, ImageHandler      = require('./handler.js')
	;


// 单个文件上传接口
web.post('/image/imageUpload', ImageHandler.uploadMiddleware.single('image'), function(req, res){
	let user = UserHandler.getUserFromSession.fromReq( req )
		;

	ImageHandler.uploadImage(user, req).then(function(rs){
		return {
			data: [rs]
			, msg: 'Done'
		};
	}, function(e){
		console.log( e );

		return {
			msg: e.message
		};
	}).then(function(json){
		res.send( JSON.stringify(json) );
		res.end();
	});
	// db.handle({
	// 	sql: Image.Model.imageAdd
	// 	, data: {}
	// }).then(function(rs){
	// 	let data = {};  // rs.data;
	//
	// 	//rs = rs.result;
	//
	// 	data.id = rs.insertId;
	//
	// 	res.send( JSON.stringify(data) );
	// 	res.end();
	// });
});
// 多个文件上传接口
web.post('/image/imagesUpload', ImageHandler.uploadMiddleware.array(), function(req, res){
	let body = req.body || {}
		, type = body.type
		;
});

//web.post('/image/demoUpload', upload.single('image'), function(req, res){
//	let body = req.body || {}
//		, type = body.type
//		, file = req.file
//		, size = ImageHandler( req.file.path )
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
//		let data = rs.data;
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
	image: function(socket, data){

	}
});

web.get('/data/image', function(req, res){});