'use strict';

/**
 * @module  model
 * @desc    数据层，统一数据、本地缓存、服务器接口的调用，数据调用统一为 setData、getData、removeData、clearData 接口，也可继承相关的类，自定义实现接口
 *          当前继承关系
	
 * */

import Model from './model';

// 缓存
import './cookie';
import './localStorage';
import './sessionStorage';
import './indexedDB';
import './webSQL';

import './service';

// // 网络请求
// import './ajax';
// import './webSocket';

// post message
//

export default Model;