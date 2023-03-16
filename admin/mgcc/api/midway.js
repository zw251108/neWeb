'use strict';

import {baseUrl} from '../config.js';
// import domain from '../runtime/domain.js';

import maple, {ServiceModel, Model} from 'cyan-maple';

const PROJECT = 'midway'
	, ls = Model.factory('ls')
	, pageGet = '/mg/page/get'
	, codeGetByIds = '/mg/code/getByIds'
	, KEY_INDEX = {
		// [pageGet]: 'path' //, 'id'
		// ,
		[codeGetByIds]: ['ids', 'id']
	}
	, midway = new ServiceModel({
		baseUrl
		, resource: {
			pageGet
			, codeGetByIds
		}
	})
	, CODE_TYPE = ['enum', 'formatter', 'validator']
	;

midway.sourceFrom(ls, (topic, {data})=>{
	let url = maple.url.parseUrl( topic ).path
		, key = KEY_INDEX[url]
		, value
		;

	if( [
		// pageGet,
		codeGetByIds].includes(url) ){
		if( Array.isArray(key) ){
			let k = key[1]
				;

			key = key[0];
			value = data[key];

			return value.map((id)=>{
				return `${url}?${k}=${id}`;
			});
		}
		else{
			value = data[key];

			return `${url}?${key}=${value}`;
		}
	}

	return false;
});

midway.syncTo(ls, (topic, {data}, res)=>{
	let url = maple.url.parseUrl( topic ).path
		, key = KEY_INDEX[url]
		, value
		,
		{ data: resData } = res
		;

	// 未返回数据不缓存
	if( !resData ){
		return false;
	}

	if( [
		// pageGet,
		codeGetByIds].includes(url) ){
		if( Array.isArray(key) ){
			let k = key[1]
				;

			key = key[0];
			value = data[key];

			return {
				topic: value.reduce((rs, v)=>{
					rs[`${url}?${k}=${v}`] = resData.find(({id})=>{
						return id === v;
					});

					return rs;
				}, {})
			};
		}

		value = data[key];

		return {
			topic: `${url}?${key}=${value}`
			, value: resData
		};
	}

	return false;
});

export default midway;

export {
	CODE_TYPE
};