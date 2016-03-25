'use strict';

var ReaderModel = require('./model.js')
	, ReaderError   = require('./error.js')

	, ReaderHandler = {
		getBookmarkReaderPerDay: function(user){
			return ReaderModel.statisticReadMarkByDate( user.id );
		}
	}

	;

module.exports = ReaderHandler;