'use strict';

/**
 * @file    业务模块接口聚会页面
 * 只提供 base、coupon、im、item、member、order、show 模块的接口实例，wechat、midway、image 模块因需要在构造时传入参数，所以不提供实例
 * */

import ServiceModel from '../model/service.js';

import './base.js';
export let base     = ServiceModel.factory('base');

import './coupon.js';
export let coupon   = ServiceModel.factory('coupon');

import './im.js';
export let imSer    = ServiceModel.factory('im');

import './item.js';
export let item     = ServiceModel.factory('item');

import './member.js';
export let member   = ServiceModel.factory('member');

import './order.js';
export let order    = ServiceModel.factory('order');

import './show.js';
export let show     = ServiceModel.factory('show');

import './image.js';
import './midway.js';

/**
 * @todo 期望改为根据全局环境动态加载
 * */
import './wechat.js';

// export let weixin   = ServiceModel.factory('wechat');
// export let midway   = ServiceModel.factory('midway');