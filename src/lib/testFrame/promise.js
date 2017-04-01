import $ from 'jquery';

/**
 * @file    Promise 基于 jQuery 的简易兼容实现，因为在 UC 浏览器中 不支持 Promise
 * @global
 * */

if( !('Promise' in self) ){
	self.Promise = function(exec){
		let defer = $.Deferred();

		try{
			exec(defer.resolve, defer.reject);
		}
		catch(e){
			defer.reject( e );
		}

		return defer.promise();
	};
	self.Promise.resolve = function(value){
		let defer = $.Deferred();

		defer.resolve( value );

		return defer.promise();
	};
	self.Promise.reject = function(e){
		let defer = $.Deferred();

		defer.reject( e );

		return defer.promise();
	};

	self.Promise.all = function(arr){
		let i = 0
			, j = arr.length
			, defer = $.Deferred()
			, rs = new Array(j)
			;

		arr.map((d, index)=>{
			d.then((obj)=>{
				i++;

				rs[index] = obj;

				if( i === j ){
					defer.resolve(rs);
				}
			});
		});

		return defer.promise();
	};
	self.Promise.race = function(arr){};

	self.Promise.prototype.then = function(){};
	self.Promise.prototype.catch = function(){};
}

export default self.Promise;