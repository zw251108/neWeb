'use strict';

/**
 * @file    设置个人信息操作
 * */

import device       from 'device';
import url          from 'url';
import model        from '../model/index.js';
import app          from '../app/index.js';
import confirm      from '../component/confirm/index.js';
import wechatBiz    from './wechat.js';

let cookie      = model.factory('c')
	, member    = model.factory('member')
	, wechat    = model.factory('wechat')
	, image     = model.factory('img')
	;

const DOWNLOAD_APP_URL = '/index/loadAndroid.html'
	;

let editUserInfo = {
	/**
	 * @summary     设置用户头像
	 * @return      {Promise}
	 * @desc        获取用户信息
	 * */
	avatar(){
		cookie.getData('hybrid').then((hybrid)=>{
			if( hybrid ){
				app.setUserHeaderImg();
			}
			else{
				return Promise.resolve();
			}
		}).catch(()=>{  // 不是 APP 环境
			if( device.wechat ){    // 微信环境
				return wechatBiz.chooseImage( 1 ).then((res)=>{
					return wechatBiz.upload( res.localIds[0] )
				}).then((res)=>{
					return wechat.getImageUrlByServerId( res.serverId );
				}).then((data)=>{
					return member.updatePhoto( data ).then( image.getImageUrl.bind(image, data, 's') );
				});
			}

			confirm({
				content: '您还没有安装最新版的APP呦~'
				, okText: '去下载'
				, cancelText: '我知道了'
			}).then(()=>{
				url.changePage( DOWNLOAD_APP_URL );
			});
		});
	}
};

export default editUserInfo;