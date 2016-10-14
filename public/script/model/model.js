import $ from 'jquery';

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
	 * @desc    设置数据
	 * @param   {String}    key
	 * @param   {*}         value
	 * @return  {Promise}
	 * */
	setData(key, value){
		this._setIndex( key );

		this._value[key] = value;

		return Promise.resolve(true);
	}
	/**
	 * @desc    获取数据
	 * @param   {String}    key
	 * @return  {Promise}
	 * */
	getData(key){
		// todo 若不存在该数据 返回 reject ?
		return Promise.resolve(this._value[key] || '');
	}
	/**
	 * @desc    将数据从缓存中删除
	 * @param   {String}    key
	 * @return  {Promise}
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
	 * @return  {Promise}
	 * */
	clearData(){
		return Promise.all(this._index.map( d=>this.removeData(d) ));
	}
}

/**
 * @desc    注册子类，若该子类已经被注册，并且缓存中没有该子类的实例，则覆盖
 * @param   {String}    type
 * @param   {Model}     model
 * */
Model.register = function(type, model){

	if( type in Model && type in Model._modelCache ){
		console.log('type', ' 重复注册，并已生成实例，不能覆盖');
	}
	else{
		Model[type] = model;
	}
};

Model._modelCache = {};

/**
 * @desc    获取或生成 type 类型的 model 对象
 * @param   {String}    type
 * @param   {Boolean?}  notCache
 * */
Model.factory = function(type, notCache){
	var model
		;
	if( type in Model ){
		if( !notCache && type in Model._modelCache ){
			model = Model._modelCache[type];
		}
		else{
			model = new Model[type]();
			Model._modelCache[type] = model;
		}
	}
	else{
		model = new Model();
	}

	return model;
};

export default Model;