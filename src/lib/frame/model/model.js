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
		this._eventList = [];
		this._syncList = {};

		this.on((topic, value)=>{
			this._sync(topic, value);
		});
	}

	// ---------- 静态方法 ----------
	/**
	 * @summary 注册子类
	 * @static
	 * @param   {String}    type
	 * @param   {Model}     model
	 * @desc    若该子类已经被注册，并且缓存中没有该子类的实例，则覆盖
	 * */
	static register(type, model){

		if( type in Model && type in Model._MODEL_CACHE ){
			console.log('type', ' 重复注册，并已生成实例，不能覆盖');
		}
		else{
			Model[type] = model;
		}
	}
	/**
	 * @summary 注册子类的别名
	 * @static
	 * @param   {String}            type        已注册的子类名
	 * @param   {String|String[]}   aliasName   该子类的别名
	 * */
	static registerAlias(type, aliasName){

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
	}
	/**
	 * @summary 获取或生成 type 类型的 Model 子类的实例或 Model 类的实例
	 * @static
	 * @param   {String}            type
	 * @param   {Boolean|Object}    [notCache=false] 为 boolean 类型时表示是否缓存，默认值为 false，设为 true 时既不从缓存中读取子类实例对象，生成的实例对象也不保存在缓存中；为 object 类型时将值赋给 options 并设置为 false
	 * @param   {Object}            [options={}]
	 * @return  {Model}             当 type 有意义的时候，为 Model 子类类的实例，否则为 Model 类的实例
	 * */
	static factory(type, notCache=false, options={}){
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

		// 判断是否存在该子类
		if( type in Model ){

			if( notCache || !(type in Model._MODEL_CACHE) ){    // 不使用缓存或没有该子类实例

				model = new Model[type]( options );

				if( !notCache ){

					// 使用缓存，将该子类实例缓存
					Model._MODEL_CACHE[type] = model;
				}
			}
			else{   // 使用缓存并存在该子类实例
				model = Model._MODEL_CACHE[type];
			}
		}
		else{
			console.log('不存在注册为 ', type, ' 的子类');
			model = new Model();
		}

		return model;
	}

	// ---------- 私有方法 ----------
	/**
	 * @summary 转为字符串，会将 null,undefined 转为空字符串
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
	 * @summary 触发绑定的数据监控事件
	 * @protected
	 * @param   {String}    topic
	 * @param   {*}         value
	 * */
	_trigger(topic, value){
		if( this._eventList.length ){
			setTimeout(()=>{
				this._eventList.forEach((d)=>d(topic, value));
			}, 0);
		}
	}
	/**
	 * @summary 数据同步的内部实现
	 * @protected
	 * @param   {String}    topic
	 * @param   {*}         value
	 * */
	_sync(topic, value){
		this._syncList.map((d)=>{
			let result
				;

			if( value !== null ){
				result = d.setData(topic, value);
			}
			else{
				result = d.removeData( topic );
			}

			result.catch(function(e){
				console.log(e, d.constructor.name, '同步失败');
			});

			return result;
		}).then(function(){
			console.log('同步完成');
		});
	}

	/**
	 * @summary 事件触发函数
	 * @callback    ModelChangeEvent
	 * @param       {String}    topic
	 * @param       {*}         newValue
	 * @param       {*}         [oldValue]
	 * @desc        函数将传入 topic,newValue 值，当 removeData 执行时也会触发事件，newValue 被传为 null
	 * */

	/**
	 * @summary 在 Promise resolve 时调用的函数
	 * @callback    promiseResolve
	 * @param       {*}     result
	 * */
	/**
	 * @summary 在 Promise reject 时调用的函数
	 * @callback    promiseReject
	 * @param       {*}     result
	 * */
	/**
	 * @typedef     {Promise.<Object,Error>}    ModelPromise
	 * @property    {Object}
	 * @property    {Object}
	 * @throws      {Error}
	 * */

	// ---------- 公有方法 ----------
	/**
	 * @summary 绑定数据监视事件
	 * @param   {ModelChangeEvent}  callback
	 * */
	on(callback){
		this._eventList.push( callback );
	}
	/**
	 * @summary 解除绑定数据监控回调函数
	 * @param   {ModelChangeEvent}  callback
	 * */
	off(callback){
		let i = this._eventList.indexOf( callback )
			;

		if( i !== -1 ){
			this._eventList.splice(i, 1);
		}
	}
	/**
	 * @summary 设置数据
	 * @param   {String}    topic   主题
	 * @param   {*}         value   value 为 null、undefined 时会被保存为空字符串
	 * @return  {Promise<Object>|Promise<Error>}   返回一个 Promise 对象，在 resolve 时传回 true
	 * @desc    设置数据的时候会使用 Object.defineProperty 定义该属性
				目前子类的实现中都调用了 super.setData，若其它子类的实现中并没有调用，但需对数据监控，应在适当的时候调用 _trigger 方法
	 * */
	setData(topic, value){
		if( topic in this._value ){
			this._value[topic] = value;
		}
		else{
			// // todo 判断是 object 类型的进行深度 defineProperty
			// if( typeof value === 'object' ){
			// 	Object.keys( value ).forEach((d)=>{
			// 		this._setObserver(value[d], d, topic);
			// 	});
			// }

			/**
			 * 不能同时设置访问器 (get 和 set) 和 writable 或 value，否则会报错误
			 * */
			Object.defineProperty(this._value, topic, {
				enumerable: true
				, configurable: false
				// , value: value
				, set(newVal){
					if( newVal !== value ){

						this._trigger(topic, newVal);
					}
				}
				, get(){
					return value;
				}
			});

			this._trigger(topic, value);
		}

		return Promise.resolve(true);
	}
	/**
	 * @summary 获取数据
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
	 * @summary 将数据从缓存中删除
	 * @param   {String}    topic
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * @desc    子类覆盖时如需对数据监控，应在适当的时候调用 _trigger 方法
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
	 * @summary 清空数据
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	clearData(){
		this._value = {};

		return Promise.resolve(true);
	}

	/**
	 * @summary 将当前 model 的数据同步到其它 model
	 * @param   {Model|Model[]}   model
	 * */
	syncTo(model){
		if( !Array.isArray(model) ){
			model = [model];
		}

		model.forEach((d)=>{
			if( typeof d === 'object' &&
				d instanceof Model &&
				d.constructor !== this.constructor &&
				this._syncList.indexOf( d ) === -1 ){

				this._syncList.push( d );
			}
			else{   // 该实例类型已经存在
				console.log('该实例类型已经存在');
			}
		});
	}
	/**
	 * @summary 清除数据同步
	 * @param   {Model} model
	 * */
	cleanSync(model){
		let i = this._syncList.indexOf( model )
			;

		if( i !== -1 ){
			this._syncList.splice(i, 1);
		}
	}
}

// ---------- 静态属性 ----------
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

export default Model;