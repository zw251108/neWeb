'use strict';

var fs = require('fs')
	, Cheerio = require('cheerio')

	, htmlToEmmet   = require('./htmlToEmmet.js')

	, getEmmet  = function( dir ){
		console.log('read file: template/', dir);
		return htmlToEmmet( Cheerio, fs.readFileSync(__dirname +'/../../template/'+ dir).toString() );
	}
	;

module.exports = getEmmet;