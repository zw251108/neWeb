/**
 * @module storage
 * */
define(['jquery'], function(){
	var store
		;

	if( 'localStorage' in window ){
		store = localStorage;
	}
	else{
		store = {
			__index: []
			, getItem: function(key){
				return this[key];
			}
			, setItem: function(key, value){
				this[key] = value;

			}
			, clear: function(){

			}
		}
	}

	return store;
});