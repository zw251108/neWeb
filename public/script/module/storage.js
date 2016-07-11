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
				this.__index.push( key );
				this[key] = value;

			}
			, clear: function(){
				var that = this
					;

				$.each(this.__index, function(i, d){
					delete that[d];
				});
			}
		}
	}

	return store;
});