'use strict';

/**
 * @class
 * @classdesc   数据层基类，将数据保存在内存中
 * @example
let model = new Model();

model.setData('index/first', true).then(function(){
	console.log('数据保存成功');
});
model.getData('index/first').then(function(value){
	console.log('获取到数据 ', value);
}, function(e){
	console.log('当数据不存在时，reject 传入 null');
});
 * */
class Model{
	/**
	 * @constructor
	 * */
	constructor(){
		this._value = {};
		this._eventList = {};
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
	 * @param   {String}    topic
	 * @param   {*}         value
	 * */
	_trigger(topic, value){
		if( topic in this._eventList ){
			setTimeout(()=>{
				this._eventList[topic].forEach((d)=>d(value));
			}, 0);
		}
	}

	/**
	 * 绑定数据监视事件
	 * @param   {String}    topic
	 * @param   {Function}  callback    事件触发函数，函数将传入 newValue 两个值，当 removeData 执行时也会触发事件，newValue 被传为 null
	 * */
	on(topic, callback){
		if( !(topic in this._eventList) ){
			this._eventList[topic] = [];
		}

		this._eventList[topic].push( callback );
	}
	/**
	 * 解除绑定数据监控回调函数
	 * @param   {String}    topic
	 * @param   {Function}  callback
	 * */
	off(topic, callback){
		let i = this._eventList[topic].indexOf( callback )
			;

		if( i !== -1 ){
			this._eventList[topic].splice(i, 1);
		}
	}
	/**
	 * 设置数据，子类覆盖时如需对数据监控，应在适当的时候调用 _trigger 方法
	 * @param   {String}    topic   主题
	 * @param   {*}         value   value 为 null、undefined 时会被保存为空字符串
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * @desc    设置数据的时候会使用 Object.defineProperty 定义该属性
	 * */
	setData(topic, value){
		if( topic in this._value ){
			this._value[topic] = value;
		}
		else{
			Object.defineProperty(this._value, topic, {
				enumerable: true
				, configurable: false
				, value: value
				, set(newVal){
					if( newVal !== value ){
						this._trigger(topic, newVal);
					}
				}
			});

			this._trigger(topic, value);
		}

		return Promise.resolve(true);
	}
	/**
	 * 获取数据
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
	 * */
	getData(topic){
		let result
			;

		if( topic in this._value ){
			result = Promise.resolve( this._value[topic] );
		}
		else{
			result = Promise.reject( null );
		}
		
		return result;
	}
	/**
	 * 将数据从缓存中删除，子类覆盖时如需对数据监控，应在适当的时候调用 _trigger 方法
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	removeData(topic){
		let rs
			;

		try {
			if( this._value.hasOwnProperty(topic) ){
				delete this._value[topic];
				rs = Promise.resolve(true);

				this._trigger(topic, null);
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
 * 子类对象缓存
 * @static
 * */
Model._MODEL_CACHE = {};
/**
 * 子类别名列表
 * @static
 * */
Model._MODEL_ALIAS = {};

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
 * 注册子类的别名
 * @static
 * @param   {String}        type        已注册的子类名
 * @param   {String|Array}  aliasName   该子类的别名
 * */
Model.registerAlias = function(type, aliasName){

	if( !Array.isArray(aliasName) ){
		aliasName = [aliasName];
	}

	aliasName.forEach((d)=>{
		if( !(d in Model._MODEL_ALIAS) ){
			Model._MODEL_ALIAS[d] = type;
		}
		else{
			console.log(d, ' 已经存在');
		}
	});
};

/**
 * 获取或生成 type 类型的 model 对象
 * @static
 * @param   {String}    type
 * @param   {Boolean|Object}   [notCache]    为 boolean 类型时表示是否缓存，默认值为 false；为 object 类型时将值赋给 options 并设置为 false
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

	// 判断 type 是否为别名
	if( !(type in Model) && (type in Model._MODEL_ALIAS) ){
		type = Model._MODEL_ALIAS[type];
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
		console.log('不存在注册为 ', type, ' 的子类');
		model = new Model(options);
	}

	return model;
};

export default Model;