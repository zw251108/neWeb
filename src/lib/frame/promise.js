import $ from 'jquery';

/**
 * @file    Promise 基于 jQuery 的简易兼容实现，因为在 UC 浏览器中 不支持 Promise
 * @global
 * @todo    实现 Promise
 * */

if( !('Promise' in self) ){

	/**
	 * @class
	 * @classdesc   Promise 的实现
	 * */
	class Promise{
		/**
		 * @constructor
		 * @param   {Function}  executor
		 * */
		constructor(executor){
			executor(()=>{  // resolve

			}, ()=>{    // reject

			});
		}

		// ---------- 静态方法 ----------
		/**
		 * @summary Promise.all 实现
		 * @param   {Array}     queue
		 * @return  {Promise}
		 * */
		static all(queue){}
		/**
		 * @summary Promise.race 实现
		 * @param   {Array}     queue
		 * @return  {Promise}
		 * */
		static race(queue){}
		/**
		 * @summary Promise.resolve 实现
		 * @param   {*}         value
		 * @return  {Promise}
		 * */
		resolve(value){
			return new Promise((resolve)=>{
				resolve( value );
			});
		}		/**
	 * @summary Promise.reject 实现
	 * @param   {*}         msg
	 * @return  {Promise}
	 * */
	reject(msg){
		return new Promise((resolve, reject)=>{
			reject( msg );
		});
	}

		// ---------- 公有方法 ----------
		/**
		 * @summary then 实现
		 * @param   {Function}  successHandler
		 * @param   {Function}  errorHandler
		 * @return  {Promise}
		 * */
		then(successHandler, errorHandler){}
		/**
		 * @summary catch 实现
		 * @param   {Function}  errorHandler
		 * @return  {Promise}
		 * */
		catch(errorHandler){}
	}

	self.Promise = Promise;

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

	// self.Promise.prototype.then = function(){};
	// self.Promise.prototype.catch = function(){};
}

export default self.Promise;