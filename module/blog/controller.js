'use strict';

var web         = require('../web.js')
	, socket    = require('../socket.js')
	, error     = require('../error.js')

	, config    = require('../../config')

	, index     = require('../index.js')
	, admin     = require('../admin.js')
	, data      = require('../data.js')

	, Model = require('./model.js')
	, View  = require('./view.js')
	, Admin = require('./admin.view.js')
	, Handler = require('./handler.js')(data)

	;


web.use('/script/module/blog.js', __dirname +'/module/blog/handler.js');

index.push({

});


web.get('/blog/', function(req, res){

	Handler.getList().then( View.blogList ).then(function( html ){
		res.send( config.docType.html5 + html );
	});

	//Model.getContentByDocumentId( DOCUMENT_ID ).then( View.document ).then(function( html ){
	//	res.send( config.docType.html5 + html );
	//	res.end();
	//});
});