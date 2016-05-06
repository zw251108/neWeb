'use strict';

/**
 * @class Send
 * */
var Send = function(data, info, msg){
	this.data = data;
	this.info = info || {};
	this.msg = msg || 'done';
};

module.exports = Send;