'use strict';

var fs = require('fs')
	, Cheerio = require('cheerio')

	, htmlToEmmet   = require('./htmlToEmmet.js')

	, getEmmet  = function( dir ){
		console.log('read file: tpl/', dir);
		return htmlToEmmet( Cheerio.load, fs.readFileSync(__dirname +'/../../tpl/'+ dir).toString() );
	}
	;

module.exports = getEmmet;