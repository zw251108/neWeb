import $ from 'jquery';

/**
 * @class Model
 * */
class Model{
	/**
	 * @constructor
	 * */
	constructor(){
		this.__index = [];
		this.__value = {};
	}
	/**
	 * @desc    设置数据索引
	 * @protected
	 * @param   {String}    key
	 * */
	__setIndex(key){
		if( !(key in this.__index) ){
			this.__index.push( key );
		}
	}
	/**
	 * @desc    删除数据索引
	 * @protected
	 * @param   {String}    key
	 * */
	__removeIndex(key){
		var i = this.__index.indexOf( key )
			;

		if( i !== -1 ){
			this.__index.splice(i, 1);
		}
	}

	/**
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}
	 * */
	setData(key, value){
		this.__setIndex( key );

		this.__value[key] = value;

		return Promise.resolve(true);
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){
		// todo 若不存在该数据 返回 reject ?
		return Promise.resolve(this.__value[key] || '');
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	removeData(key){
		var rs
			;
		this.__removeIndex( key );

		try {
			delete this.__value[key];
			rs = Promise.resolve(true);
		}
		catch(e){
			rs = Promise.reject(e);
		}

		return rs;
	}
	/**
	 * @desc    清空数据
	 * @return  {Promise}
	 * */
	clearData(){
		return Promise.all(this.__index.map( d=>this.removeData(d) ));
	}
}

/**
 * @desc    注册子类，若该子类已经被注册，并且缓存中没有该子类的实例，则覆盖
 * @param   {String}    type
 * @param   {Model}     model
 * */
Model.register = function(type, model){

	if( type in Model && type in Model.__modelCache ){
		console.log('type', ' 重复注册，并已生成实例，不能覆盖');
	}
	else{
		Model[type] = model;
	}
};

Model.__modelCache = {};

/**
 * @desc    获取或生成 type 类型的 model 对象
 * @param   {String}    type
 * @param   {Boolean?}  notCache
 * */
Model.factory = function(type, notCache){
	var model
		;
	if( type in Model ){
		if( !notCache && type in Model.__modelCache ){
			model = Model.__modelCache[type];
		}
		else{
			model = new Model[type]();
			Model.__modelCache[type] = model;
		}
	}
	else{
		model = new Model();
	}

	return model;
};

export default Model;