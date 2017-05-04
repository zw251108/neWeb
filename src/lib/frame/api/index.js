'use strict';

/**
 * @file    业务模块接口聚合页面
 * @desc    只提供 base、coupon、im、item、member、order、show、ipc、pay、push、img 模块的接口实例，wechat、midway 模块因需要在构造时传入参数，所以不提供实例
 *          当前继承关系
 <pre>
                                        +----------------+
                                        |                |
                                        |  ServiceModel  |
                                        |                |
                                        +-------+--------+
                                                |
                                                |
        +-------------+-----------+-------------+------------+-----------+------------+---------------+
        |             |           |             |            |           |            |               |
        |             |           |             |            |           |            |               |
        |             |           |             |            |           |            |               |
        |             v           |             v            |           v            |               v
        |  +----------+---------+ | +-----------+----------+ | +---------+----------+ | +-------------+-------+
        |  |                    | | |                      | | |                    | | |                     |
        |  |  BaseServiceModel  | | |  CouponServiceModel  | | |  ItemServiceModel  | | |  OrderServiceModel  |
        |  |                    | | |                      | | |                    | | |                     |
        |  +--------------------+ | +----------------------+ | +--------------------+ | +---------------------+
        |                         |                          |                        |
        +-----------------+       +---------------+          +---------------+        +--------------+
        |                 |       |               |          |               |        |              |
        v                 |       v               |          v               |        v              |
 +------+---------------+ | +-----+-------------+ | +--------+-------------+ | +------+------------+ |
 |                      | | |                   | | |                      | | |                   | |
 |  MemberServiceModel  | | |  PayServiceModel  | | |  TicketServiceModel  | | |  IpcServiceModel  | |
 |                      | | |                   | | |                      | | |                   | |
 +----------------------+ | +-------------------+ | +----------------------+ | +-------------------+ |
                          |                       |                          |                       |
            +-------------+          +------------+               +----------+          +------------+
            |             |          |            |               |          |          |            |
            |             v          |            v               |          v          |            v
            | +-----------+--------+ | +----------+-------------+ | +--------+--------+ | +----------+---------+
            | |                    | | |                        | | |                 | | |                    |
            | |  ShowServiceModel  | | |  DiscoverServiceModel  | | |  ImServiceModel | | |  PushServiceModel  |
            | |                    | | |                        | | |                 | | |                    |
            | +--------------------+ | +------------------------+ | +-----------------+ | +--------------------+
            |                        |                            |                     |
            |                        |                            |                     |
            |                        |                            |                     |
            v                        v                            v                     v
 +----------+-----------+   +--------+-------------+   +----------+----------+   +------+------------+
 |                      |   |                      |   |                     |   |                   |
 |  WechatServiceModel  |   |  MidwayServiceModel  |   |  ImageServiceModel  |   |  LogServiceModel  |
 |                      |   |                      |   |                     |   |                   |
 +----------------------+   +----------------------+   +---------------------+   +-------------------+
 </pre>
 * */

import Model from '../model/model.js';
import '../model/service.js';

/**
 * 业务模块
 * */
import './base.js';
export let base     = Model.factory('base');

import './coupon.js';
export let coupon   = Model.factory('coupon');

import './im.js';
export let imSer    = Model.factory('im');

import './item.js';
export let item     = Model.factory('item');

import './ipc.js';
export let ipc      = Model.factory('ipc');

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

import './ticket.js';
export let ticket   = Model.factory('ticket');

import './discover.js';
export let discover = Model.factory('discover');


import './midway.js';
// export let midway   = Model.factory('midway');

/**
 * 工具模块
 * */
import './image.js';
export let img      = Model.factory('img');

import './log.js';
export let log      = Model.factory('log');