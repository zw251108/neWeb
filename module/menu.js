'use strict';

var Menu = {
	items: []
	, index: {}
	, register: function(){
		var i = 0
			, j = arguments.length
			, t
			, id
			, module = this.items
			, index = this.index
			;

		for(; i < j; i++ ){
			t = arguments[i];
			id = t.id;

			if( id ){
				if( id in index ){
					console.log( new MenuError(id + ' 菜单项已被注册') );
				}
				else{
					index[id] = module.length;
					module.push( t );
				}
			}
			else{
				console.log( new MenuError('菜单项缺少 id') );
			}
		}
	}
	, current: function(curr){
		return this.items.map(function(d){
			d.on = d.id === curr;
			return d;
		});
	}
}
	, MenuError = function(msg){
		this.message = msg;
	}
	;

MenuError.prototype = new Error();

module.exports = Menu;