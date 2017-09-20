'use strict';

/**
 * @namespace   maple.util.validate
 * */

let validate = {
	/**
	 * @summary     检查是否为数字
	 * @function    isInteger
	 * @memberOf    maple.util.validate
	 * @param       {Number|String} id
	 * @return      {Boolean}
	 * */
	isInteger(id){
		return /^[0-9]+$/.test( id )
	}
	/**
	 * @summary     检查是否为对象
	 * @function    isObject
	 * @memberOf    maple.util.validate
	 * @param       {Object}    object
	 * @return      {Boolean}
	 * */
	, isObject(object){
		return Object.prototype.toString.call( object ) === "[object Object]";
	}
	/**
	 * @summary     检测是否为时间字符串
	 * @function    isTimeStr
	 * @memberOf    maple.util.validate
	 * @param       {String}    str
	 * @return      {Boolean}
	 * */
	, isTimeStr(str){
		return typeof str === 'string' && /^\d+(s|m|h|d|y)?$/.test(str);
	}

	/**
	 * @summary     检查是否为有逗号分隔的数字列表格式
	 * @function    checkNumberListFormat
	 * @memberOf    maple.util.validate
	 * @param       {Number|String} numberList
	 * @return      {Boolean}
	 * */
	, checkNumberListFormat(numberList){
		return /^\d+(,\d+)*$/.test( numberList );
	}
	/**
	 * @summary     检查是否为 DESC 或 ASC
	 * @function    checkOrderType
	 * @memberOf    maple.util.validate
	 * @param       {String}    orderType
	 * @return      {Boolean}
	 * */
	, checkOrderType(orderType){
		return /^DESC$|^ASC$/i.test( orderType );
	}
	/**
	 * @summary     检测是否为手机号码
	 * @function    checkPhoneNum
	 * @memberOf    maple.util.validate
	 * @param       {String}    phone
	 * @return      {Boolean}
	 * */
	, checkPhoneNum(phone){
		return /^(13\d)|(14[0-35-9])|(18[05-9])\d{8}$/.test( phone );
	}
};

export default validate;