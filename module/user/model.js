'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, Promise   = require('promise')

	, UserError = require('./error.js')

	, SQL = {}
	, Model = {}
	;

module.exports = Model;