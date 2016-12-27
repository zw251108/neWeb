import $ from '../../../public/script/lib/jquery.min';

/**
 * Promise 简易兼容实现
 *  因为在 UC 浏览器中 不支持 Promise
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
}

export default self.Promise;