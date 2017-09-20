'use strict';

/**
 * @file    本地存储使用
 * @todo    保留？
 * */

/**
 * @namespace   tg.biz.storeCache
 * */

import Model        from '../model/index.js';
import validate     from '../util/validate.js';
import merge        from '../util/merge.js';
import dateFormat   from '../util/dateFormat.js';

const SESSION_KEY   = 'tg_session_cache'
	, LOCAL_KEY     = 'tg_local_cache'
	;

let ls      = Model.factory('ls')
	, ss    = Model.factory('ss')
	;

/**
 * @summary     对 sessionStorage 中的 tg_session_cache 数据进行处理
 * @function    sessionData
 * @memberOf    tg.biz.storeCache
 * @param       {Object|String} [key]
 * @param       {*}             [value]
 * @return      {Promise}
 * */
let sessionData = function(key, value){
	let argc = arguments.length
		;

	return ss.getData( SESSION_KEY ).catch(()=>{
		return {};
	}).then((data)=>{
		let result = undefined
			;

		if( !argc ){    // 返回全部数据
			result = data
		}
		else if( argc === 1 ){  // 只有一个参数，参数为 object 类型为设置，为 string 类型为读取
			if( validate.isObject(key) ){
				data = merge(key, data);

				ss.setData(SESSION_KEY, data);
			}
			else{
				result = data[key];
			}
		}
		else if( argc === 2 ){  // 两个参数，设置
			data[key] = value;

			ss.setData(SESSION_KEY, data);
		}

		return result;
	});
};
/**
 * @summary 对 sessionStorage 中的 tg_session_cache 的数据进行删除
 * @param   {...String} key
 * @return  {Promise}
 * */
sessionData.remove = function(key){
	let argc = arguments.length
		, result
		;

	if( !argc ){
		result = sessionData.removeAll();
	}
	else{
		result = ss.getData( SESSION_KEY ).catch(()=>{
			return {};
		}).then((data)=>{
			[].slice.call( arguments ).forEach((d)=>{
				data[d] = undefined;

				delete data[d];
			});

			return ss.setData(SESSION_KEY, data);
		});
	}

	return result;
};
/**
 * @summary 对 sessionStorage 中的 tg_session_cache 的数据清空
 * @return  {Promise}
 * */
sessionData.removeAll = function(){
	return ss.setData(SESSION_KEY, {});
};

/**
 * @summary 格式化 localStorage 中的 tg_local_cache 的数据，筛选掉过期数据
 * @param   {Object}    data
 * @return  {Object}
 * */
let formatLocalData = function(data){
	return Object.keys( data ).reduce((all, d)=>{
		if( t - data[d].t < data[d].time || !data[d].time ){
			all[d] = data[d].value;
		}

		return all;
	}, {});
};
/**
 * @summary     对 localStorage 中的 tg_local_cache 的数据进行处理
 * @function    localData
 * @memberOf    tg.biz.storeCache
 * @param       {Object|String} key
 * @param       {*}             [value]
 * @param       {String}        [time]
 * @return      {Promise}
 * */
let localData = function(key, value, time){
	let argc = arguments.length
		, t = Date.now()
		;

	if( validate.isObject(key) ){
		if( argc === 2 ){
			time = value;
			value = '';
		}
	}

	return ls.getData( LOCAL_KEY ).catch(()=>{
		return {};
	}).then((data)=>{
		let result = undefined
			;

		if( !argc ){
			result = formatLocalData( data );
		}
		else if( argc === 1 ){
			if( validate.isObject(key) ){
				key = Object.keys( key ).reduce((all, d)=>{
					all[d] = {
						value: key[d]
						, time: 0
						, t
					};

					return all;
				}, {});

				data = merge(key, data);

				ls.setData(LOCAL_KEY, data);
			}
			else{
				result = formatLocalData( data )[key];
			}
		}
		else if( argc === 2 ){
			if( validate.isObject(key) && validate.isTimeStr(time) ){
				key = Object.keys( key ).reduce((all, d)=>{
					all[d] = {
						value: key[d]
						, time: dateFormat.formatTimeStr(time, '')
						, t
					};

					return all;
				}, {});

				data = merge(key, data);
			}
			else{
				data[key] = {
					value
					, time: 0
					, t
				};
			}

			ls.setData(LOCAL_KEY, data);
		}
		else if( argc === 3 ){
			data[key] = {
				value
				, time
				, t
			};

			ls.setData(LOCAL_KEY, data);
		}

		return result;
	});
};
/**
 * @summary 对 localStorage 中的 tg_local_cache 的数据进行删除
 * @param   {Object|String} key
 * @return  {Promise}
 * */
localData.remove = function(key){
	let argc = arguments.length
		, result
		;

	if( !argc ){
		result = localData.removeAll();
	}
	else{
		result = ls.getData( LOCAL_KEY ).catch(()=>{
			return {};
		}).then((data)=>{
			[].slice.call( arguments ).forEach((d)=>{
				data[d] = undefined;

				delete data[d];
			});

			return ls.setData(LOCAL_KEY, data);
		});
	}

	return result;
};
/**
 * @summary 对 localStorage 中的 tg_local_cache 的数据清空
 * @return  {Promise}
 * */
localData.removeAll = function(){
	return ls.setData(LOCAL_KEY, {});
};

export default {
	sessionData
	, localData
};