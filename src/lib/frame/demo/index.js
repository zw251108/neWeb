'use strict';

/**
 * @file    首页
 * */

import $ from 'jquery';

// UI 及相关组件
import Vue from 'vue';
import '/javascript/libs/tg/component/head/index.js';
import 'javascript/libs/tg/component/poster/index.js';
import 'javascript/libs/tg/component/message/index.js';
import 'javascript/libs/tg/component/barcode/index.js';
import 'javascript/libs/tg/component/tabbar/index.js';
import 'javascript/libs/tg/component/swipertabbar/index.js';
import 'javascript/libs/tg/component/foot/index.js';
import 'javascript/libs/tg/component/download/index.js';
import 'javascript/libs/tg/component/selectbar/index.js';
import 'javascript/libs/tg/component/loadding/index.js';
import 'javascript/libs/tg/component/autoload/index.js';
import 'javascript/libs/tg/component/step/index.js';
import 'javascript/libs/tg/component/secKill/index.js';

import 'javascript/libs/tg/filter/index.js';

// 业务框架
import tg from 'tg';

let cookie = tg.model.factory('cookie')
	, ls = tg.model.factory('localStorage')
	, service = tg.model.factory('service')
	, midway = tg.model.service.factory('midway', {
		makeArray: ['counterProductGroup', 'adPoster', 'product']
	})
	;

/**
 * 将门店 ID 设置到 cookie 里
 * @function
 */
function setStoreId(){
	let storeId
		;

	if( arguments[0] !== undefined && !isNaN(+arguments[0]) ){
		storeId = arguments[0];
	}
	else{
		let urlStoreId = maple.url().params.storeId;
		if( urlStoreId ){
			storeId = urlStoreId;
		}
	}

	if( storeId ){
		cookie.setData('storeId', storeId, '1y');
	}
}
/**
 * 将城市 ID 设置到 cookie 里
 * @function
 * */
function setCityId(){
	let cityId
		;

	if( arguments[0] !== undefined && !isNaN(+arguments[0]) ){
		cityId = arguments[0];
	}
	else{
		let urlCityId = maple.url().params.cityId;
		if( urlCityId ){
			cityId = urlCityId;
		}
	}

	if( cityId ){
		cookie.setData('cityId', cityId, '1y');
	}
}
/**
 * 将去过的门店设置到 cookie 中
 * @function
 * */
function setVisitStores(){
	Promise.all([
		cookie.getData('visitStores').catch(function(){return {};})
		, cookie.getData('cityId')
		, cookie.getData('storeId')
	]).then(function([visitStores, cityId, storeId]){
		let cityStores = visitStores[cityId]
			, j
			;

		if( !cityStores ){
			cityStores = visitStores[cityId] = [];
		}

		j = cityStores.indexOf( storeId );  // 判断 storeId 是否存在
		if( j !== -1 ){
			cityStores.splice(j, 1);
		}
		cityStores.unshift( storeId );

		visitStores[cityId] = cityStores.slice(0, 3);

		cookie.setData('visitStores', visitStores);
	});
}
/**
 * 设置顶部搜索条的效果
 * @function
 * */
function headBarEffect(){
	$(document).on('scroll', function(e){
		window.indexheadSerchDom = window.indexheadSearchDom || $('#indexheadSearch');
		window.pageStyleSheet = window.pageStyleSheet || Array.prototype.slice.call($('#pageStyle')[0].sheet.cssRules).filter(function(item){return item.selectorText=="#indexSearch::-webkit-input-placeholder"})[0];

		let scrollT = maple.scrollBar('top').px
			, rgbat = (scrollT - 50)/50
			, rgba  = rgbat > 0.9 ? 0.9 : rgbat
			;

		if( scrollT > 70 ){
			window.indexheadSearchDom.addClass('text-dark borderb');
			window.pageStyleSheet.style.color='#666666'
		}
		else{
			window.indexheadSearchDom.removeClass('text-dark borderb');
			window.pageStyleSheet.style.color='white'
		}

		window.indexheadSearchDom.css('background-color', 'rgba(255,255,255,'+ rgba +')');
	});
}
/**
 * 获取用户会员卡数据
 * @function
 * */
let loadMemberCardInfo = function(){
	let hasload = false;

	return function(url, vm){
		if( !hasload ){
			hasload = true;

			service.getData(url).then(function(data){
				data = data[0].data;
				
				vm.myCardtext = data.title;
				vm.myCardscp = vm.myCardtext === '我的会员卡'?'00':'set';

				if( data.loginStatus ){
					vm.myCardUrl = data.clickUrl;
				}
				else{
					vm.myCardUrl = 'login/login.html?loginBack='+ encodeURIComponent('/tempPage/selectCardPage.html');
				}
			});
		}
	}
};

// 生成 VM
let hasIframe = false
	, vm = new Vue({
	el: 'body'
	, data: {}
	, methods: {}
	, watch: {
		shopBanner: function(){
			if( this.shopBanner.cardHttpUrl ){
				loadMemberCardInfo(this.shopBanner.cardHttpUrl, this);
			}
		},
		baseInfo: function(){
			this.baseInfo.storeId && cookie.setData('storeId', this.baseInfo.storeId);
			
			setVisitStores();
		}
		, windowPoster: function(){
			if( hasIframe ){
				return
			}
			cookie.getData('indexPop').catch(()=>{
				if( this.windowPoster.clickUrl ){
					hasIframe = true;

					let iframe = $('<iframe></iframe>');

					iframe.attr('src', this.windowPoster.clickUrl);
					iframe.attr('frameborder', '0');
					iframe.css({
						height:Math.min.call(this, window.screen.height *0.8, 420) +'px'
						, width:Math.min.call(this, window.screen.width *0.8, 280) +'px'
					});
					iframe.appendTo('#indexIframe .mask_content');
					iframe.load(()=>{
						setTimeout(()=>{
							if( this.stepExec ){    // 新手引导已执行
								this.windowPop = 'visible';
							}
							else{
								this.windowPop = 'ready';
							}
						}, 1000);
					})
				}
			})
		}
	}
	, events: {
		// loadTabComponent:function(item, target){//超市的TABBAR事件
		// 	this.$delete('product');
		// 	that.loadMidData( item.httpUrl );
		// },
		// loadswiperTabComponent:function(item,target){//百货的TABBAR事件
		// 	var _this=this;
		// 	var url=this.selectTabBar.baseUrl;
		// 	if(item.params){
		// 		url+='&'+item.params
		// 	}
		// 	if(target.id=='indexMall1'){
		// 		that.vm.$refs.indexmalltab2.activeIndex=-1;
		// 	}
		// 	if(target.id=='indexMall2'&&that.vm.$refs.indexmalltab1.nowParams){
		// 		url+='&'+that.vm.$refs.indexmalltab1.nowParams
		// 	}
		// 	_this.pageLoadding=true;
		// 	that.loadMidData({
		// 		url:url,
		// 		before:function(){
		// 			_this.$set('counterProductGroup',[])
		// 		},
		// 		after:function(){
		// 			_this.pageLoadding=false
		// 		}
		// 	})
		// }
		// , stepComplete: function(){
		// 	localStorage.setItem('index/index/first', true);
		// 	this.stepExec = true;
		// 	if( this.windowPop === 'ready' ){   // 弹窗广告已加载
		// 		this.windowPop = 'visible';
		// 	}
		// }
		// , showCouponPopup: function(){
		// 	this.showjiesuanma = false;
		// }
	}
})
	;

// 读取中间件数据
midway.getMidData('/index/index/init.node').then(function(data){

}).then(function(){

});

// 新手引导
ls.getData('index/index/first').then(function(){
	// 从 localStorage 中读取到数据，不是第一次访问
	vm.$set('stepExec', true);
}, function(){
	// 未读到数据，第一次访问
	vm.$set('isFirst', true);
});