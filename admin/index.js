'use strict';

var db          = require('../module/db.js')
	, web       = require('../module/web.js')
	;

web.get('/admin/', function(req, res){

	res.end();
});