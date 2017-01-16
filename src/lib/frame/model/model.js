'use strict';

// import '../promise';

/**
 * @class
 * @desc    数据层基类，将数据保存在内存中
 * */
class Model{
	/**
	 * @constructor
	 * */
	constructor(){
		this._value = {};
		this._eventList = [];
	}

	/**
	 * 转为字符串，会将 null,undefined 转为空字符串
	 * @protected
	 * @param   {*}     value
	 * @return  {String}
	 * */
	_stringify(value){

		if( value === null || value === undefined ){
			value = '';
		}

		return typeof value === 'object' ? JSON.stringify( value ) : value.toString();
	}
	/**
	 * 触发绑定的数据监控事件
	 * @protected
	 * @param   {String}    key
	 * @param   {*}         value
	 * */
	_trigger(key, value){
		setTimeout(()=>{
			this._eventList.forEach((d)=>d(key, value));
		}, 0);
	}

	/**
	 * 绑定数据监视事件
	 * @param   {Function}  callback    事件触发函数，函数将传入 key,newValue 两个值，当 newValue 为 null 时，视为 removeData 触发
	 * */
	on(callback){
		this._eventList.push( callback );
	}
	/**
	 * 解除绑定数据监控回调函数
	 * @param   {Function}  callback
	 * */
	off(callback){
		let i = this._eventList.indexOf( callback )
			;

		this._eventList.splice(i, 1);
	}
	/**
	 * 设置数据，子类覆盖时如需对数据监控，应在适当的时候调用 _trigger 方法
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * @desc    设置数据的时候会使用 Object.defineProperty 定义该属性
	 * */
	setData(key, value){
		if( key in this._value ){
			this._value[key] = value;
		}
		else{
			Object.defineProperty(this._value, key, {
				enumerable: true
				, configurable: false
				, value: value
				, set(newVal){
					if( newVal !== value ){
						this._trigger(key, newVal);
					}
				}
			});

			this._trigger(key, value);
		}

		return Promise.resolve(true);
	}
	/**
	 * 获取数据
	 * @param   {String}    key
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回查询出来的 value
	 * */
	getData(key){
		return Promise.resolve(this._value[key] || '');
	}
	/**
	 * 将数据从缓存中删除，子类覆盖时如需对数据监控，应在适当的时候调用 _trigger 方法
	 * @param   {String}    key
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	removeData(key){
		let rs
			;

		try {
			if( this._value.hasOwnProperty(key) ){
				delete this._value[key];
				rs = Promise.resolve(true);

				this._trigger(key, null);
			}
			else{
				rs = Promise.reject( new Error('只能删除自定义属性') );
			}
		}
		catch(e){
			rs = Promise.reject( e );
		}

		return rs;
	}
	/**
	 * 清空数据
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	clearData(){
		this._value = {};

		return Promise.resolve(true);
	}
}

/**
 * @static
 * @desc    子类对象缓存
 * */
Model._MODEL_CACHE = {};

/**
 * 注册子类，若该子类已经被注册，并且缓存中没有该子类的实例，则覆盖
 * @static
 * @param   {String}    type
 * @param   {Model}     model
 * */
Model.register = function(type, model){

	if( type in Model && type in Model._MODEL_CACHE ){
		console.log('type', ' 重复注册，并已生成实例，不能覆盖');
	}
	else{
		Model[type] = model;
	}
};

/**
 * 获取或生成 type 类型的 model 对象
 * @static
 * @param   {String}    type
 * @param   {Boolean|Object}   [notCache]    为 boolean 类型时表示是否缓存默认值为 false，为 object 类型时将值赋给 options 并设置为 false
 * @param   {Object}    [options]
 * @return  {Model}
 * */
Model.factory = function(type, notCache=false, options={}){
	let model
		;

	if( typeof notCache === 'object' ){
		options = notCache;
		notCache = false;
	}

	if( type in Model ){
		if( !notCache && type in Model._MODEL_CACHE ){
			model = Model._MODEL_CACHE[type];
		}
		else{
			model = new Model[type](options);
			Model._MODEL_CACHE[type] = model;
		}
	}
	else{
		model = new Model(options);
	}

	return model;
};

export default Model;