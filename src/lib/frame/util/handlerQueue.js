'use strict';

class HandlerQueue{
	/**
	 * @constructor
	 * */
	constructor(){
		this._queue = [];
		this._currIndex = 0;
	}

	// ---------- 公有函数 ----------
	/**
	 * @summary 向队列中添加 handler
	 * @param   {Function}  handler
	 * @return  {Number}    handler 在队列中的 id，方便删除
	 * */
	add(handler){
		if( typeof handler === 'function' ){
			return this._queue.push( handler );
		}
		else{
			return -1;
		}
	}
	/**
	 * @summary 从队列中移除相应的 handler
	 * @param   {Number|Function}   findBy
	 * */
	remove(findBy){

		if( typeof findBy === 'function' ){
			findBy = this._queue.indexOf( findBy );
		}
		else if( typeof findBy === 'number' ){
			findBy = parseInt( findBy );    // 去掉小数
		}
		else{
			return;
		}

		if( findBy > -1 ){
			this._queue[findBy] = null;
		}
	}
	/**
	 * @summary 清空队列
	 * */
	empty(){
		this._queue = [];
		this._currIndex = 0;
	}
	/**
	 * @summary 队列中是否还有剩余
	 * @return  {Boolean}
	 * */
	remain(){
		return this._currIndex < this._queue.length;
	}
	/**
	 * @summary 按顺序返回队列中的 handler
	 * @return  {Function|Null}
	 * @desc    当队列为空时或到队列末尾时返回 null
	 * */
	next(){
		let result = null
			, i = this._currIndex
			, j = this._queue.length
			;
		
		if( j ){
			for(; i < j; i++ ){
				result = this._queue[i];

				if( result !== null ){
					break;
				}
			}
			if( i !== j ){
				this._currIndex = i +1;
			}
		}

		return result;
	}
	/**
	 * @summary 重置队列
	 * */
	reset(){
		this._currIndex = 0;
	}
	/**
	 * @summary 执行队列中的一个 handler，内部指针将指向下一个 handler
	 * @param   {Object}    [context]
	 * @param   {...*}
	 * @return  {*}
	 * @desc    当出入参数时，第一个参数被视为上下文（context）指向 handler 的 this，剩余参数被视为传入 handler 的参数
	 * */
	fire(context){
		let args = [].slice.apply( arguments )
			, temp = this.next()
			, result
			;

		if( args.length ){
			args.shift();

			result = temp.apply(context, args);
		}
		else{
			result = temp();
		}

		return result;
	}
	/**
	 * @summary 执行队列中的全部 handler，将返回一个结果数组
	 * @param   {Object}    [context]
	 * @param   {...*}
	 * @return  {Array}
	 * @desc    当传入参数时，第一个参数被视为上下文（context）指向 handler 的 this，剩余参数被视为传入 handler 的参数（所有 handler 都会传入相同的参数），全部执行后会重置
	 * */
	fireAll(context){
		let args = [].slice.apply( arguments )
			, result
			;

		if( args.length ){
			args.shift();
		}

		result = this._queue.filter((d)=>{
			return d !== null;
		}).map((d)=>{
			if( typeof context === 'object' ){
				return d.apply(context, args)
			}
			else{
				return d();
			}
		});

		this.reset();

		return result;
	}
	/**
	 * @summary 以 reduce 的形式执行队列中的全部 handler，即前一个 handler 的返回结果作为下一个 handler 的参数
	 * @param   {Object}    [context]
	 * @param   {*}         [init]
	 * @return  {Promise}
	 * @desc    当传入参数时，第一个参数被视为上下文（context）指向 handler 的 this，第二个参数被视为传入第一个 handler 的参数，全部执行后会重置
	 *          由于为 reduce 方式调用，将只允许传入一个初始参数，并且原则上所有 handler 都应只有一个参数
	 *          由于为 reduce 方式调用，将返回 Promise 类型的结果
	 * */
	fireReduce(context, init){
		let result = Promise.resolve( init )
			;

		result = this._queue.filter((d)=>{
			return d !== null;
		}).reduce((promise, d)=>{
			return promise.then((rs)=>{
				if( typeof context === 'object' ){
					return d.call(context, rs);
				}
				else{
					return d( rs );
				}
			});
		}, result);

		this.reset();

		return result;
	}
}

export default HandlerQueue;