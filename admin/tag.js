'use strict';
/**
 *
 * */
var db          = require('../module/db/db.js')
	, web       = require('../module/web/web.js')

	, fs    = require('fs')
	, tagHTML = fs.readFileSync(__dirname + '/tag.html').toString()
	;


web.get('/admin/tag', function(req, res){

	db.handle({
		sql: 'select * from tag'
	}).then(function(rs){
		rs = rs.result;

		res.send( tagHTML.replace('/*=tag_data*/', ' ='+ rs) );
		res.end();
	});
});