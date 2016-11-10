'use strict';

/**
 * @class Model
 * */
class Model{
	/**
	 * @constructor
	 * */
	constructor(){
		this._index = [];
		this._value = {};
	}
	/**
	 * @desc    设置数据索引
	 * @protected
	 * @param   {String}    key
	 * */
	_setIndex(key){
		if( !(key in this._index) ){
			this._index.push( key );
		}
	}
	/**
	 * @desc    删除数据索引
	 * @protected
	 * @param   {String}    key
	 * */
	_removeIndex(key){
		var i = this._index.indexOf( key )
			;

		if( i !== -1 ){
			this._index.splice(i, 1);
		}
	}
	/**
	 * @desc    转为字符串
	 * @protected
	 * @param   {*}     value
	 * @return  {String}
	 * todo ?
	 * */
	_stringify(value){
		return typeof value === 'object' ? JSON.stringify( value ) : value.toString();
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}   resolve 时传回 true
	 * */
	setData(key, value){
		this._setIndex( key );

		this._value[key] = value;

		return Promise.resolve(true);
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回查询出来的 value
	 * */
	getData(key){
		// todo 若不存在该数据 返回 reject ?
		return Promise.resolve(this._value[key] || '');
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}   resolve 时传回 true
	 * */
	removeData(key){
		var rs
			;
		this._removeIndex( key );

		try {
			delete this._value[key];
			rs = Promise.resolve(true);
		}
		catch(e){
			rs = Promise.reject(e);
		}

		return rs;
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}   resolve 时传回 true
	 * */
	clearData(){
		this._index.map(d=>this.removeData(d));

		return Promise.resolve(true);
	}
}

/**
 * @desc    注册子类，若该子类已经被注册，并且缓存中没有该子类的实例，则覆盖
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

// 缓存
Model._MODEL_CACHE = {};

/**
 * @desc    获取或生成 type 类型的 model 对象
 * @param   {String}    type
 * @param   {Boolean|Object?}   notCache    为 boolean 类型时表示是否缓存，为 object 类型时将值赋给 options 并设置为 false
 * @param   {Object?}   options
 * */
Model.factory = function(type, notCache=false, options={}){
	var model
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