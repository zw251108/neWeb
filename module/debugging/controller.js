'use strict';

var CONFGIG = require('../../config.js')
	, web       = require('../web.js')
	, socket    = require('../socket.js')
	;

web.get('/debugging/', function(req, res){
	res.send('');
	res.end();
});

socket.register({
	js: function(){

	}
});