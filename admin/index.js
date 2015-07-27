'use strict';

var db          = require('../module/db/db.js')
	, web       = require('../module/web/web.js')
	;

web.get('/admin/', function(req, res){

	res.end();
});