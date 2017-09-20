'use strict';

import url      from 'url';
import Model    from '../model/index.js';

let cookie = Model.factory('cookie');

/**
 * @class
 * @classdesc   为 APP 提供接口
 * */
class App{
	/**
	 * @constructor
	 * */
	constructor(){}

	// ---------- 静态方法 ----------
	/**
	 * @summary 用于修改 url 参数
	 * @static
	 * @param   {String|Object} obj
	 * */
	static updateUrlParams(obj){
		try{
			if( typeof obj === 'string' ){
				obj = JSON.parse( obj );
			}

			url.updateParams();
		}
		catch( e ){
		}
	}
	/**
	 * @summary headerMenuEvent
	 * @static
	 * */
	static headerMenuEvent(){
	}
	/**
	 * @summary headStoreEvent
	 * @static
	 * */
	static headStoreEvent(){
	}
	/**
	 * @summary changeState
	 * @static
	 * */
	static changeState(){
	}
	/**
	 * @summary hideHeaderMenu
	 * @static
	 * */
	static hideHeaderMenu(){
	}
	/**
	 * @summary showMsgRedPoint
	 * @static
	 * */
	static showMsgRedPoint(){
	}
	/**
	 * @summary hideMsgRedPoint
	 * @static
	 * */
	static hideMsgRedPoint(){
	}
	/**
	 * @summary searchEvent
	 * @static
	 * */
	static searchEvent(){
	}
	/**
	 * @summary tokenCallback
	 * @static
	 * */
	static tokenCallback(){
	}
	/**
	 * @summary gotoFittingShowWatch
	 * @static
	 * */
	static gotoFittingShowWatch(){
	}
	/**
	 * @summary tgBackEvent
	 * @static
	 * */
	static tgBackEvent(){
	}
	/**
	 * @summary tgTrackPage
	 * @static
	 * */
	static tgTrackPage(){
	}
	/**
	 * @summary leftFling
	 * @static
	 * */
	static leftFling(){
	}
	/**
	 * @summary rightFling
	 * @static
	 * */
	static rightFling(){
	}

	// ---------- 公有方法 ----------
	/**
	 * @summary 是否支持 iOS Pay
	 * @return  {Boolean}
	 * */
	isSupportIosPay(){
		try{
			return window.app.isSupportIosPay() === 'true';
		}
		catch(e){
			return false;
		}
	}
	/**
	 * @summary 调用 iOS Pay
	 * @param   {Number} orderId 订单编号
	 * @return  {*}
	 * */
	iosPay(orderId){
		try{
			return window.app.iosPay( orderId );
		}
		catch(e){}
	}
	/**
	 * @summary 推送消息，传递最大的 id
	 * @param   {String}    maxId       传入 id 或 '-1'
	 * @param   {String}    messageType 消息类型
	 * @desc    messageType 目前有 501、502、503、504
	 *          501     降价通知
	 *          502     活动卷消息
	 *          503     活动消息
	 *          504     试衣秀消息（系统信息、献花、评论）
	 * */
	getMessageMaxId(maxId, messageType){
		try{
			return window.app.getMessageMaxId(maxId, messageType);
		}
		catch(e){}
	}
	/**
	 * @summary 弹出 notice，msg 消息，5000 毫秒持续时间
	 * @param   {String}    msg
	 * @param   {Number}    time
	 * @todo    目前没有调用到，取消？
	 * */
	notice(msg, time){
		try{
			setTimeout(function(){
				window.app && window.app.showNoticeDialog && window.app.showNoticeDialog(msg, time);
			}, 50);
		}
		catch(e){}
	}
	/**
	 * @summary 打开遮罩 mask，msg 消息
	 * @param   {String}    [msg='加载中...']
	 * @todo    目前没有调用到，取消？
	 * */
	mask(msg='加载中...'){
		msg = msg || '加载中...';
		try{
			setTimeout(function(){
				window.app.showMaskDialog( msg );
			}, 50);
		}
		catch(e){}
	}
	/**
	 * @summary 关闭遮罩 mask
	 * */
	unmask(){
		try{
			setTimeout(function(){
				window.app.cancccelMaskDialog();
			}, 50);
		}
		catch(e){}
	}
	/**
	 * @summary 页面滚动到 y 位置
	 * @param   {Number}    y
	 * @todo    有一次调用，但被注释掉，取消？
	 * */
	scrollTo(y=0){
		y = y || 0;
		try{
			window.app.scrollTo( y );
		}
		catch(e){}
	}
	/**
	 * @summary 弹出日期选择窗，callback 回调方法，在回调函数 callback 中传入选择的日期 time
	 * @param   {Function}  callback
	 * @desc    callback 被释放到全局为 tgOkCallback
	 * */
	showDateDialog(callback){
		callback = callback || function(){};

		window.tgOkCallback = function(time){
			callback( time );

			window.tgOkCallback = null; // 释放内存
		};

		try{
			window.app.showDateDialog('tgOkCallback');
		}
		catch(e){}
	}
	/**
	 * @summary 保存一条数据，参数为 JSON 字符串
	 * @param   {String}    key
	 * @param   {String}    value
	 * @param   {String}    time
	 * @todo    目前没有调用到，取消？
	 * */
	saveDB(key, value, time){
		try{
			window.app.saveDB(key, value, time);
		}
		catch(e){}
	}
	/**
	 * @summary 查询一条数据，id 为主键 key，返回 JSON 字符串
	 * @return  {String}
	 * @todo 目前没有调用到，取消？
	 * */
	findDB(key){
		try{
			return window.app.findDB( key );
		}
		catch(e){}
	}
	/**
	 * @summary 打开二维码扫描
	 * */
	codeScan(){
		try{
			window.app.codeScan();
		}
		catch(e){}
	}
	/**
	 * @summary 获取基础信息
	 * @return  {*}
	 * @todo    目前没有调用到，取消？
	 * */
	getBaseInfo(){
		try{
			return window.app.getBaseInfo();
		}
		catch(e){}
	}
	/**
	 * @summary 页面是否被遮盖（如筛选），被遮盖 isOverLay 为 true，否则为 false
	 * @param   {Boolean}   flag    是否遮罩
	 * */
	isOverlay(flag){
		try{
			// todo 期望不依赖于页面 html、css
			if( flag ){
				$('.tg_page').css('position', 'fixed');
			}
			else{
				$('.tg_page').css('position', '');
			}

			window.app.isOverlay( flag );
		}
		catch(e){}
	}
	/**
	 * @summary 弹出 alert，参数为 JSON 字符串
	 * @param   {String}    obj
	 * @todo    目前没有调用到，取消？
	 * @todo    若不取消，期望传入参数更详细
	 * */
	showAlertDialog(obj){
		try{
			window.app.showAlertDialog( obj );
		}
		catch(e){}
	}
	/**
	 * @summary 弹出 confirm，参数为 JSON 字符串
	 * @param   {String}    obj
	 * @todo 有一次调用，但被注释掉，取消？
	 * @todo 若不取消，期望传入参数更详细
	 * */
	showConfirmDialog(obj){
		try{
			window.app.showConfirmDialog( obj );
		}
		catch(e){}
	}
	/**
	 * @summary 弹出列表窗口，参数为 JSON 字符串
	 * @param   {String}    obj
	 * @todo    目前没有调用到，取消？
	 * @todo    若不取消，期望传入参数更详细
	 * */
	showListDialog(obj){
		try{
			window.app.showListDialog( obj );
		}
		catch(e){}
	}
	/**
	 * @summary 退出系统
	 * @todo    目前没有调用到，取消？
	 * @todo    若不取消，期望传入参数更详细
	 * */
	exit(){
		try{
			window.app.exit();
		}
		catch(e){}
	}
	/**
	 * @summary 获取当前 APP 版本，类型为数字
	 * @return  {Promise}
	 * */
	getTgAppVersion(){
		let result
			;

		if( 'tgAppVersion' in this ){
			result = Promise.resolve( this.tgAppVersion );
		}
		else{
			result = new Promise(function(resolve){
				resolve( Number(window.app.getTgAppVersion()).toString().match(/\d+/)[0] );
			}).catch( cookie.getData.bind(cookie, 'hybridVersion') ).catch(()=>{
				return 0;
			}).then((tgAppVersion)=>{
				this.tgAppVersion = tgAppVersion;
			});
		}
		
		return result;
	}
	/**
	 * @summary 覆盖 App 后退事件，目前调用时传入的参数为 'event:App.tgBackEvent'
	 * @param   {String}    event
	 * @todo    调用的代码被覆盖重写，取消？
	 * @todo    若不取消，期望传入参数规则
	 * */
	tgBackEvent(event){
		// todo 与 cookie 解耦
		cookie.getData('global').then((value)=>{

			return this.getTgAppVersion().then((version)=>{

				//根据版本号，进行不同处理
				if( version < 3 && value === 'android' ){
					event = event.split(':')[1];
				}

				window.app.tgBackEvent( event );
			});
		}).catch((e)=>{});
	}
	/**
	 * @summary 页面加载完毕
	 * */
	tgWebOver(){
		let flg = true
			;

		try{
			$('script').each(function(){
				// todo ?
				if( /114\.247\.28\.96/.test( this.src ) ){
					flg = false;
				}
			});

			flg && window.app.tgWebOver();
		}
		catch(e){}
	}
	/**
	 * @summary 设置 header 标题
	 * @param   {String}    title
	 * */
	setTgTitle(title){
		try{
			window.app.setAppHeaderTitle( JSON.stringify({
				title
			}) );
		}
		catch(e){}
	}
	/**
	 * @summary 切换页面，通知 App 增加历史记录
	 * @param   {String}    url
	 * @param   {String}    isNeedRefresh   true 或 false 的字符串格式
	 * */
	addTgHistory(url, isNeedRefresh='false'){
		isNeedRefresh = isNeedRefresh || 'false';

		try{
			window.app.addTgHistory(url, isNeedRefresh);
		}
		catch(e){}
	}
	/**
	 * @summary 跳转原生页
	 * @param   {String}    code
	 * @param   {String}    url
	 * @param   {String}    [event]
	 * @desc    目前 code 有 'dengLu'、'shiYiLieBiao'
	            event 有 'event:Ap.gotoFittingShowWatch'
	 * @todo    期望传入参数规则
	 * */
	tgChangePage(code, url, event){
		try{
			window.app.tgChangePage(code, url, event);
		}
		catch(e){}
	}
	/**
	 * @summary 首页弹窗加载完毕
	 * @desc    调用 tgWebOver，用途？
	 * */
	tgShowWindow(){
		try{
			window.app.tgWebOver();
		}
		catch(e){}
	}
	/**
	 * @summary 通知 App 登录密码修改
	 * @param   {String}    password
	 * */
	tgUpdatePassword(password){
		if( !password ){
			return;
		}

		try{
			window.app.tgUpdatePassword( password );
		}
		catch(e){}
	}
	/**
	 * @summary 通知 App 后退
	 * */
	tgPageBack(){
		try{
			window.app.tgPageBack();
		}
		catch(e){}
	}
	/**
	 * @summary 通知 App 退出登录
	 * */
	tgLogout(){
		try{
			window.app.tgLogout();
		}
		catch(e){}
	}
	/**
	 * @summary 隐藏 App 的 menus
	 * */
	hideAppMenus(){
		try{
			window.app.hideAppMenus();
		}
		catch(e){}
	}
	/**
	 * @summary 显示 App 的 menus
	 * */
	showAppMenus(){
		try{
			window.app.showAppMenus();
		}
		catch(e){}
	}
	/**
	 * @summary 用户设置头像
	 * @desc    要求版本号 >= 7
	 * */
	setUserHeaderImg(){
		try{
			window.app.setUserHeaderImg();
		}
		catch(e){}
	}
	updateUserName(name){
		try{
			window.app.updateUserName( name );
		}
		catch(e){}
	}
	/**
	 * @summary 设置分享信息
	 * @param   {String|Object} shareInfo
	 * @param   {String}        shareInfo.imgUrl
	 * @param   {String}        shareInfo.url
	 * @param   {String}        shareInfo.title
	 * @param   {String}        shareInfo.subTitle
	 * @param   {String}        shareInfo.friendTitle
	 * @param   {String}        shareInfo.link
	 * @param   {Boolean}       shareInfo.isFittingShowPage
	 * @param   {String}        shareInfo.fittingShowImageUrl
	 * @param   {String}        shareInfo.fittingShowText
	 * @param   {String}        shareInfo.fittingClickUrl
	 * @param   {String}        shareInfo.fittingShowCounterName
	 * @param   {String}        shareInfo.fittingStoreName
	 * @param   {String}        [shareUrl]
	 * @param   {String}        [shareTitle]
	 * @desc    当版本号小于 3 时，三个参数都必须传，当版本号大于等于 3 时，要传 object 类型参数
	 * @todo    fittingShow* 的参数似乎已无用了
	 * */
	customShare(shareInfo, shareUrl, shareTitle){
		this.getTgAppVersion().then((version)=>{
			if( version < 3 ){
				window.app.customShare(shareInfo, shareInfo.url, shareTitle);
			}
			else{
				window.app.customShare( JSON.stringify(shareInfo) );
			}
		}).catch((e)=>{});
	}
	/**
	 *
	 * */
	showWifi(msg='抱歉，没有检测到免费Wi-Fi热点'){
		try{
			window.app.showWifi( msg );
		}
		catch(e){}
	}

	setCurStoreName(){}
	/**
	 * @summary 调用 IM 聊天，老版本中用户之间聊天和用户联系客服统一使用此接口，在新版本中添加 startChatWithService 接口，期望将其分离
	 * @param   {Object}    info
	 * */
	startChatWith(info){
		this.getTgAppVersion().then(function(version){
			if( version >= 5 ){
				window.app.startChatWith( JSON.stringify(info) );
			}
		}).catch(function(e){});
	}
	/**
	 * @summary 调用 IM 联系客服，新版本添加用来部分替代 startChatWith，期望将用户之间聊天和用户联系客服分开
	 * @param   {Object}        info
	 * @param   {String}        info.counterUrl             专柜页面  url
	 * @param   {Object}        [info.productInfo]          商品信息
	 * @param   {String}        info.productInfo.productUrl 商品页面 url
	 * @param   {String}        info.productInfo.imageUrl   商品图片 url
	 * @param   {String}        info.productInfo.title      商品名称
	 * @param   {Number|String} info.productInfo.price      商品价格
	 * @param   {Object}        [info.orderInfo]            订单信息
	 * @param   {String}        info.orderInfo.orderUrl     订单页面 url
	 * @param   {String}        info.orderInfo.imageUrl     订单第一个商品图片 url
	 * @param   {String}        info.orderInfo.orderId      订单 id
	 * @param   {Number|String} info.orderInfo.price        订单总价
	 * @param   {String}        info.orderInfo.time         订单下单时间（YYYY-MM-DD hh:mm 格式）
	 * @desc    参数在之前 startChatWith 的基础上添加 counterUrl,productInfo,orderInfo，分别对应专柜页面 url，商品信息，订单信息
	            startChatWithService 内部判断当 window.app 不存在 startChatWithService 方法时会降级调用 startChatWith
	 * */
	startChatWithService(info){
		this.getTgAppVersion().then(function(version){
			if( version >= 5 ){
				if( 'startChatWithService' in window.app ){
					window.app.startChatWithService( JSON.stringify(info) );
				}
				else{
					window.app.startChatWith( JSON.stringify(info) );
				}
			}
		}).catch(function(e){});
	}
	setHeaderArrowDirection(){}
	setAppStateText(){}
	setShareEnable(){}
	toggleDropList(){}
	setAppArrowDirection(){}
	setAppHeaderTitle(){}
	selectTopic(){}
	alipay(){}
	contactCenter(){}
	setShakeGuestureJSCallback(){}
	/**
	 * @summary     发布发现
	 * @param       {Object}    [params={}] 目前为占位，并没有传参
	 * */
	publishDiscover(params={}){
		try{
			window.app.publishDiscover( JSON.stringify(params) );
		}
		catch(e){}
	}
	/**
	 * @summary     播放视频
	 * @param       {Object}    params
	 * @param       {String}    params.imgUrl
	 * @param       {String}    params.videoUrl
	 * */
	playVideo(params={}){
		try{
			window.app.playVideo( JSON.stringify(params) );
		}
		catch(e){}
	}
	/**
	 * @summary     更换封面
	 * @param       {Object}        [params={}]
	 * @param       {Number|String} params.memberId
	 * */
	changeCover(params={}){
		try{
			window.app.changeCover( JSON.stringify(params) );
		}
		catch(e){}
	}
	/**
	 * @summary     立刻分享撒娇礼
	 * @param       {Object}    params
	 * @desc        同分享接口参数结构相同，现有
	 * */
	shareCrowd(params){
		try{
			window.app.shareCrowd( JSON.stringify(params) );
		}
		catch(e){}

	}
	/**
	 * @summary     弹窗
	 * @param       {Object}    params
	 * @param       {String}    params.imageUrl     显示的内容图片链接
	 * @param       {String}    params.httpUrl      点击确定是发送请求的路径
	 * @param       {String}    params.clickUrl     发送请求成功返回时的跳转路径
	 * @desc        目前为跨境新人礼包调用到
	 * */
	popupHttpPoster(params){
		try{
			window.app.popupHttpPoster( JSON.parse(params) );
		}
		catch(e){}
	}
	/**
	 * @summary 通知 app 已经取消订阅
	 * @param   {Number}        state   是否订阅，1.订阅，2.取消订阅
	 * @param   {Number|String} storeId
	 * */
	cancelStore(state, storeId){
		try{
			window.app.cancelStore(state, storeId);
		}
		catch(e){}
	}
}

window.App = App;

let app = new App();

export {
	App
	, app
};