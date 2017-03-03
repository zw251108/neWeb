'use strict';

import Model from '../model/index.js';

let cookie = Model.factory('cookie');

/**
 * @class
 * @classdesc   为 APP 提供接口
 * */
class App{
	/**
	 * 是否支持 iOS Pay
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
	 * 调用 iOS Pay
	 * @param   {Number} orderId 订单编号
	 * @return
	 * */
	iosPay(orderId){
		try{
			return window.app.iosPay( orderId );
		}
		catch(e){}
	}
	/**
	 * 推送消息，传递最大的 id
	 * @param   {String}    maxId   传入 id 或 '-1'
	 * @param   {String}    messageType 消息类型
	 * @desc    目前有 501、502、503、504
	 *  501     降价通知
	 *  502     活动卷消息
	 *  503     活动消息
	 *  504     试衣秀消息（系统信息、献花、评论）
	 * */
	getMessageMaxId(maxId, messageType){
		try{
			return window.app.getMessageMaxId(maxId, messageType);
		}
		catch(e){}
	}
	/**
	 * 弹出 notice，msg 消息，5000 毫秒持续时间
	 * @param   {String}    msg
	 * @param   {Number}    time
	 * @todo 目前没有调用到，取消？
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
	 * 打开遮罩 mask，msg 消息
	 * @param   {String}    [msg='加载中...']
	 * @todo 目前没有调用到，取消？
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
	 * 关闭遮罩 mask
	 *
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
	 * 页面滚动到 y 位置
	 * @param   {Number}    y
	 * @todo 有一次调用，但被注释掉，取消？
	 * */
	scrollTo(y=0){
		y = y || 0;
		try{
			window.app.scrollTo( y );
		}
		catch(e){}
	}
	/**
	 * 弹出日期选择窗，callback 回调方法
	 * @param   {Function}  callback
	 * @desc    在回调函数 callback 中传入选择的日期 time
	 * */
	showDateDialog(callback){
		callback = callback = function(){};
		window.tgOkCallback = function(time){
			callback( time );
		};

		try{
			window.app.showDateDialog('tgOkCallback');
		}
		catch(e){}
	}
	/**
	 * 保存一条数据，参数为 JSON 字符串
	 * @param   {String}    key
	 * @param   {String}    value
	 * @param   {String}    time
	 * @todo 目前没有调用到，取消？
	 * */
	saveDB(key, value, time){
		try{
			window.app.saveDB(key, value, time);
		}
		catch(e){}
	}
	/**
	 * 查询一条数据，id 为主键 key，返回 JSON 字符串
	 * @return  {String}
	 * @todo 目前没有调用到，取消？
	 * */
	findDB(key){
		try{
			return window.app.findDB(key);
		}
		catch(e){}
	}
	/**
	 * 打开二维码扫描
	 * */
	codeScan(){
		try{
			window.app.codeScan();
		}
		catch(e){}
	}
	/**
	 * 获取基础信息
	 * @return  {*}
	 * @todo 目前没有调用到，取消？
	 * */
	getBaseInfo(){
		try{
			return window.app.getBaseInfo();
		}
		catch(e){}
	}
	/**
	 * 页面是否被遮盖（如筛选），被遮盖 isOverLay 为 true，否则为 false
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
	 * 弹出 alert，参数为 JSON 字符串
	 * @param   {String}    obj
	 * @todo 目前没有调用到，取消？
	 * @todo 若不取消，期望传入参数更详细
	 * */
	showAlertDialog(obj){
		try{
			window.app.showAlertDialog( obj );
		}
		catch(e){}
	}
	/**
	 * 弹出 confirm，参数为 JSON 字符串
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
	 * 弹出列表窗口，参数为 JSON 字符串
	 * @param   {String}    obj
	 * @todo 目前没有调用到，取消？
	 * @todo 若不取消，期望传入参数更详细
	 * */
	showListDialog(obj){
		try{
			window.app.showListDialog( obj );
		}
		catch(e){}
	}
	/**
	 * 退出系统
	 * @todo 目前没有调用到，取消？
	 * @todo 若不取消，期望传入参数更详细
	 * */
	exit(){
		try{
			window.app.exit();
		}
		catch(e){}
	}
	/**
	 * 覆盖 App 后退事件
	 * @param   {String}    event
	 * @desc    目前调用时传入的参数为 'event:App.tgBackEvent'
	 * @todo 调用的代码被覆盖重写，取消？
	 * @todo 若不取消，期望传入参数规则
	 * */
	tgBackEvent(event){
		// todo 与 cookie 解耦
		cookie.getData('global').then((value)=>{

			//根据版本号，进行不同处理
			if( this.getTgAppVersion() < 3 && value === 'android' ){

				event = event.split(':')[1];
			}

			window.app.tgBackEvent( event );
		}).catch(function(e){
		});
	}
	/**
	 * 页面加载完毕
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
	 * 设置 header 标题
	 * @param   {String}    title
	 * */
	setTgTitle(title){
		try{
			window.app.setAppHeaderTitle( JSON.stringify({
				title
			}) );
		}
	}
	/**
	 * 切换页面，通知 App 增加历史记录
	 * @param   {String}    url
	 * @param   {String}    isNeedRefresh true 或 false 的字符串格式
	 * */
	addTgHistory(url, isNeedRefresh='false'){
		isNeedRefresh = isNeedRefresh || 'false';

		try{
			window.app.addTgHistory(url, isNeedRefresh);
		}
		catch(e){}
	}
	/**
	 * 跳转原生页
	 * @param   {String}    code
	 * @param   {String}    url
	 * @param   {String}    [event]
	 * @desc    目前 code 有 'dengLu'、'shiYiLieBiao'
	 *  event 有 'event:Ap.gotoFittingShowWatch'
	 * @todo 期望传入参数规则
	 * */
	tgChangePage(code, url, event){
		try{
			window.app.tgChangePage(code, url, event);
		}
		catch(e){}
	}
	/**
	 * 首页弹窗加载完毕
	 * */
	tgShowWindow(){
		try{
			window.app.tgWebOver();
		}
		catch(e){}
	}
	/**
	 * 通知 App 登录密码修改
	 * @param   {String}    password
	 * @return
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
	 * 通知 App 后退
	 * */
	tgPageBack(){
		try{
			window.app.tgPageBack();
		}
		catch(e){}
	}
	/**
	 * 通知 App 退出登录
	 * */
	tgLogout(){
		try{
			window.app.tgLogout();
		}
		catch(e){}
	}
	/**
	 * 隐藏 App 的 menus
	 * */
	hideAppMenus(){
		try{
			window.app.hideAppMenus();
		}
		catch(e){}
	}
	/**
	 * 显示 App 的 menus
	 * */
	showAppMenus(){
		try{
			window.app.showAppMenus();
		}
		catch(e){}
	}
	/**
	 * @todo 返回值类型？
	 * @return  {Promise}
	 * */
	getTgAppVersion(){
		try{
			return Promise.resolve( Number(window.app.getTgAppVersion().toString().match(/\d+/)[0]) );
		}
		catch(e){
			// todo 获取 cookie
		}
	}
	setUserHeaderImg(){}
	customShare(){}
	showWifi(){}
	updateUserName(){}
	setCurStoreName(){}
	startChatWith(){}
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
}

/**
 * 用于修改 url 参数
 * @param   {String|Object} obj
 * */
App.updateUrlParams = function(obj){
	try{
		if( typeof obj === 'string' ){
			obj = JSON.parse( obj );
		}
	}
};
App.headerMenuEvent = function(){};
App.headStoreEvent = function(){};
App.changeState = function(){};
App.hideHeaderMenu = function(){};
App.showMsgRedPoint = function(){};
App.hideMsgRedPoint = function(){};
App.searchEvent = function(){};
App.tokenCallback = function(){};
App.gotoFittingShowWatch = function(){};
App.tgBackEvent = function(){};
App.tgTrackPage = function(){};
App.leftFling = function(){};
App.rightFling = function(){};

window.App = App;

export default App;