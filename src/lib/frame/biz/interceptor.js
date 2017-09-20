'use strict';

/**
 * @file    设置数据请求响应拦截器
 *          构建防黄牛机制
 * */

import model        from '../model/index.js';
import {app}        from '../app/index.js';
import notice       from '../component/notice/index.js';
import errorCode    from './errorCode.js';

let secKeyModel = model.factory()
	, cookie    = model.factory('c')
	, member    = model.factory('member')
	, service   = model.service
	;

/**
 * @summary     请求拦截器函数
 * @callback    ReqInterceptor
 * @param       {String}            topic
 * @param       {Object}            [options]
 * @return      {Boolean|Promise}
 * @desc        拦截器处理函数，将传入 setData、getData 调用时传入的参数，返回值为 false 或 Promise.reject 或抛出异常将停止继续进行
 *              请求拦截器用于判断是否发送请求以及添加参数操作
 * */

/**
 * @summary 返回一个随机数
 * @param   {Number}    sec
 * @param   {Number}    i   时间戳
 * @return  {Number}
 * */
let cheatBreaker = (sec, i)=>{
	let e = sec || undefined
		, k = (e || '') +''
		;

	if( e === undefined || e === -1 ){
		return e;
	}

	return [
		(e + 8) * 8,
		e + i % 1000000,
		2 * 1000 + e,
		e + 821029,
		+k[k.length - 1],
		(e % 10) * (+k[k.length - 1]) - e,
		i + e,
		777,
		8 + 88 + 888 + 8888 + 88888 + 888888,
		3 + e
	][e % 10];
};

/**
 * 防黄牛机制，由请求参数中的 needSecKey 调用
 * */
service.interceptor.req.add((topic, options={})=>{
	if( options.needSecKey ){
		console.log(topic, '使用了防黄牛机制');

		return secKeyModel.getData('secKey', 'timestamp').then((rs)=>{
			let {secKey} = rs
				, result
				;

			if( secKey === null ){  // 没有防黄牛机制参数
				result = Promise.reject();
			}
			else{
				result = cookie.getData('isLogin').catch(()=>{
					return false;
				}).then((isLogin)=>{
					if( secKey === -1 && isLogin ){ // 判断是否登录
						return Promise.reject();
					}
					else{
						return rs;
					}
				});
			}

			return result.catch(()=>{
				return member.secKey().then( secKeyModel.getData.bind(secKeyModel, 'secKey', 'timestamp') );
			});
		}).then(({secKey, timestamp})=>{

			options.data = options.data || {};

			options.data.secKey = secKey;
			options.data.timestamp = timestamp;
			options.data.secValue = cheatBreaker(secKey, timestamp);
		});
	}
});
/**
 * APP 下 im 相关接口传 APP 版本号，由请求参数中的 tgAppVersion 调用
 * */
service.interceptor.req.add((topic, options={})=>{
	if( options.tgAppVersion ){
		return cookie.getData('hybrid').catch(()=>{
			return false;
		}).then((hybrid)=>{
			if( hybrid ){
				return app.getTgAppVersion().then((version)=>{
					options.data = options.data || {};

					options.data.tgAppVersion = version;
				});
			}
		});
	}
});
/**
 * 个性化推荐-跨境单品推荐-传用户的 uuid
 * */
service.interceptor.req.add((topic, options={})=>{
	if( options.uuid ){
		return cookie.getData('tgs_uuid', 'cellPhone', 'memberId').then(({tgs_uuid, cellPhone, memberId})=>{
			options.data = options.data || {};

			options.uuid = tgs_uuid;
			options.cellPhone = cellPhone;
			options.memberId = memberId;
		});
	}
});


/**
 * @summary     响应拦截器函数
 * @callback    ResInterceptor
 * @param       {Object}            res
 * @return      {Object|Promise}
 * @desc        拦截器处理函数，将传入 setData、getData 发出请求成功后返回的数据，返回值为进行处理后的数据，Promise.reject 或抛出异常将停止继续进行
 *              响应拦截器用于过滤响应数据，所以需要返回 Object 类型数据或一个 Promise
 * */

service.interceptor.res.add((res)=>{
	let execute
		, secKey = res.secKey
		, timestamp = res.timestamp
		;

	if( res instanceof Error ){ // 请求失败
		execute = Promise.reject( res );
	}
	else if( res.success ){ // 请求成功

		// 设置防黄牛机制参数
		if( secKey && timestamp ){

			// 设置时间戳
			execute = secKeyModel.setData({
				secKey
				, timestamp
				, secValue: cheatBreaker(secKey, timestamp)
			});
		}
		else{
			execute = Promise.resolve();
		}

		execute = execute.then(()=>{
			return res.data;
		});
	}
	else{   // 请求成功，服务器端返回错误
		execute = Promise.reject( res );
	}

	return execute.catch((e)=>{ // 错误处理
		let execute
			;

		if( !e || (e instanceof Error) ){   // 异常报错
			notice('网络好像不给力喔，请检查一下您的网络设置');

			// todo 统计错误

			execute = Promise.reject();
		}
		else{   // 服务器端返回异常
			let res = e
				;

			if( ('code' in res) && (res.code in errorCode) ){   // 存在错误代码
				execute = errorCode[res.code]();
			}
			else if( ('message' in res) && res.message !== 'undefined' ){
				notice( res.message );
			}
			else{
				notice('网络好像不给力喔，请检查一下您的网络设置');
			}

			execute = execute || Promise.reject();
		}

		return execute;
	});
});