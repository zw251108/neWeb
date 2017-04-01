'use strict';

/**
 * @file    业务模块接口聚合页面
 * @desc    只提供 base、coupon、im、item、member、order、show 模块的接口实例，wechat、midway、image 模块因需要在构造时传入参数，所以不提供实例
 * */

import Model from '../model/model.js';
import '../model/service.js';

import './base.js';
export let base     = Model.factory('base');

import './coupon.js';
export let coupon   = Model.factory('coupon');

import './im.js';
export let imSer    = Model.factory('im');

import './item.js';
export let item     = Model.factory('item');

import './ipc.js';
export let ipt      = Model.factory('ipc');

import './member.js';
export let member   = Model.factory('member');

import './order.js';
export let order    = Model.factory('order');

import './pay.js';
export let pay      = Model.factory('pay');

import './push.js';
export let push     = Model.factory('push');

import './show.js';
export let show     = Model.factory('show');

import './image.js';
export let img      = Model.factory('img');

import './midway.js';
// export let midway   = Model.factory('midway');

/**
 * @todo 期望改为根据全局环境动态加载
 * */
import './wechat.js';

// export let weixin   = Model.factory('wechat');