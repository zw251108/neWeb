'use strict';

/**
 * 后台模块
 * */
var AdminError = function(msg){
		this.message = msg;
	}
	, Admin = {
		modules: []
		, index: {}
		, register: function(){
			var i = 0
				, j = arguments.length
				, t
				, id
				, module = this.modules
				, index = this.index
				;

			for(; i < j; i++){
				t = arguments[i];
				id = t.id;

				if( id ){
					if( id in index ){
						console.log( new AdminError(id + ' 后台模块已被注册') );
					}
					else{
						index[id] = module.length;
						module.push( t );
					}
				}
				else{
					console.log( new AdminError('模块缺少 id') );
				}
			}
		}
		, current: function(curr){
			return this.modules.map(function(d){
				d.on = d.id === curr;
				return d;
			});
		}
	}
	;

AdminError.prototype = new Error();

module.exports = Admin;