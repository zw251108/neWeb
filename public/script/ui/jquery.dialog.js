;(function(p, jqPath){
	if( typeof exports === 'object' && typeof module === 'object' ){
		p( require( jqPath || 'jquery' ) );
	}
	else if( typeof define === 'function' && define.amd ){
		define([jqPath || 'jquery'], p);
	}
	else{
		p(jQuery);
	}
})(function($){

}, '');
