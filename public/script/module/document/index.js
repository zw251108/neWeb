/**
 *
 * */
require(['../config'], function(config){
	var r = require(config.requireConfig);
	r(['document'], function(document){});
});