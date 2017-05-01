'use strict';

let validate = {
		/**
		 * 检查是否为数字
		 * @param   {Number|String} id
		 * @return  {Boolean}
		 * */
		isInteger(id){
			return /^[0-9]+$/.test( id )
		}
		/**
		 * 检查是否为对象
		 * @param   {Object}    object
		 * @return  {Boolean}
		 * */
		, isObject(object){
			return Object.prototype.toString.call( object ) === "[object Object]";
		}

		/**
		 * 检查是否为有逗号分隔的数字列表格式
		 * @param   {Number|String} numberList
		 * @return  {Boolean}*
		 * */
		, checkNumberListFormat(numberList){
			return /^\d+(,\d+)*$/.test( numberList );
		}
		/**
		 * 检查是否为 DESC 或 ASC
		 * */
		, checkOrderType(orderType){
			return /^DESC$|^ASC$/i.test( orderType );
		}

		, checkPhoneNum(phone){
			return /^(13\d)|(14[0-35-9])|(18[05-9])\d{8}$/.test( phone );
		}
	}
	;

export default validate;