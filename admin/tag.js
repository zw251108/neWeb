'use strict';
/**
 *
 * */
var web     = require('../module/web/web.js')
	, db    = require('../module/db/db.js')

	, fs    = require('fs')
	, tagHTML = fs.readFileSync(__dirname + '/tag.html').toString()
	;


web.get('/admin/tag', function(req, res){
	db.query('select * from tag', function(err, rs){
		if( !err ){
			rs = JSON.stringify( rs );
			res.send( tagHTML.replace('/*=tag_data*/', ' ='+ rs) );
			res.end();
		}
		else{
			console.log('error, tag db');
		}
	});
});