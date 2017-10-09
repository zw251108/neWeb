/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		1: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData === 0) {
/******/ 			return new Promise(function(resolve) { resolve(); });
/******/ 		}
/******/
/******/ 		// a Promise means "currently loading".
/******/ 		if(installedChunkData) {
/******/ 			return installedChunkData[2];
/******/ 		}
/******/
/******/ 		// setup Promise in chunk cache
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunkData[2] = promise;
/******/
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "js/" + chunkId + ".js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) {
/******/ 					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				}
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		return promise;
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    全局事件监听对象
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.listener = exports.Listener = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debounce = __webpack_require__(7);

var _debounce2 = _interopRequireDefault(_debounce);

var _throttle = __webpack_require__(8);

var _throttle2 = _interopRequireDefault(_throttle);

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @classdesc   全局事件监听抽象类
 * @desc        默认使用捕获方式
 * @todo        调整，兼容 addEventListener 的参数结构？
 * */
var Listener = function () {
	/**
  * @constructor
  * @param   {Object}                    config
  * @param   {String}                    config.type
  * @param   {Window|Document|Object}    [config.target]
  * @param   {Boolean}                   [config.useCapture]
  * @param   {Boolean}                   [config.passive]
  * @param   {Boolean}                   [config.useDebounce]    是否使用 debounce
  * @param   {Boolean}                   [config.useThrottle]    是否使用 throttle
  * @todo    处理 passive 参数
  * */
	function Listener() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Listener);

		if (!config.type) {
			console.log('未指定监听事件');

			throw new Error('未指定监听事件');
		}

		this._config = (0, _merge2.default)(config, Listener._CONFIG);

		this._isListening = false; // 当前监听状态

		this._listener = null; // 执行函数

		this._eventQueue = []; // 事件对列
	}

	// ---------- 私有方法 ----------
	/**
  * @summary 生成函数执行队列
  * @private
  * @return  {Function}
  * */


	_createClass(Listener, [{
		key: '_queueExecute',
		value: function _queueExecute() {
			var eventQueue = this._eventQueue;

			return function () {
				var rs = true,
				    i = 0,
				    j = eventQueue.length,
				    that = this || null,
				    argv = [].slice.call(arguments);

				for (; i < j; i++) {
					rs = eventQueue[i].apply(that, argv);

					if (rs === false) {
						return false;
					}
				}

				return rs;
			};
		}

		/**
   * @summary     监听事件回调
   * @callback    ListenerCallback
   * @param       {Object|Event}  event
   * @param       {...*}
   * */

		// ---------- 公有方法 ----------
		/**
   * @summary 添加执行函数
   * @param   {ListenerCallback}  callback
   * @return  {Listener}          返回 this，可以使用链式操作
   * */

	}, {
		key: 'add',
		value: function add(callback) {
			if (this._eventQueue.indexOf(callback) === -1) {
				this._eventQueue.push(callback);
			} else {
				console.log('该函数已经存在于队列中');
			}

			return this;
		}
		/**
   * @summary 开始监听事件
   * @param   {Number}    [wait=0]    间隔时间，单位为毫秒，若传则使用 debounce 或 throttle 方式执行
   * @return  {Listener}  返回 this，可以使用链式操作
   * @desc    当传入 wait 参数时根据生成 Listener 对象实例时的 useDebounce 或 useThrottle 参数来判断使用哪种方式，若都设置则 debounce 优先
   * */

	}, {
		key: 'on',
		value: function on() {
			var wait = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			wait = Number(wait);

			if (this._isListening) {
				return this;
			}

			if (!this._config.target) {
				return this;
			}

			if (this._config.useDebounce && wait && wait > 0) {
				this._listener = (0, _debounce2.default)(this._queueExecute(), wait);
			} else if (this._config.useThrottle && wait && wait > 0) {
				this._listener = (0, _throttle2.default)(this._queueExecute(), wait);
			} else {
				this._listener = this._queueExecute();
			}

			if ('addEventListener' in this._config.target) {
				this._config.target.addEventListener(this._config.type, this._listener, this._config.useCapture);
			}

			this._isListening = true;

			return this;
		}
		/**
   * @summary 取消监听
   * @param   {Boolean|Function}  [isAll=true]
   * @return  {Listener}          返回 this，可以使用链式操作
   * @desc    若传入参数为 true，则将将事件监听解除绑定，若传入参数类型为函数，则只将该函数从函数队列删除，不解除监听事件
   * */

	}, {
		key: 'off',
		value: function off() {
			var isAll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


			if (!this._config.target) {
				return this;
			}

			if (typeof isAll === 'boolean' && isAll) {

				if ('removeEventListener' in this._config.target) {
					this._config.target.removeEventListener(this._config.type, this._listener, this._config.useCapture);
				}

				if ('cancel' in this._listener) {
					this._listener.cancel();

					this._listener = null;
				}

				this._isListening = false;
			} else if (typeof isAll === 'function') {
				var index = this._eventQueue.indexOf(isAll);

				this._eventQueue.splice(index, 1);
			}

			return this;
		}
		/**
   * @summary 立即执行
   * @param   {...*}
   * */

	}, {
		key: 'trigger',
		value: function trigger() {
			var context = this._config.target,
			    event = {
				type: this._config.type,
				target: this._config.target
			},
			    argv = [].slice.call(arguments);

			argv.unshift(event);

			if ('immediate' in this._listener) {
				this._listener.immediate(context, argv);
			} else {
				this._listener.apply(context, argv);
			}
		}
	}]);

	return Listener;
}();

/**
 * 监听事件的默认配置
 * @static
 * @const
 * */


Listener._CONFIG = {
	type: '',
	target: window || self || null,
	useCapture: true,
	passsive: true,
	useDebounce: false,
	useThrottle: false
};

/**
 * @summary     快速监听函数
 * @param       {Window|Document|Object|String}     target                  监听对象，当类型为 String 时视为 type，将其赋值给 type，将 target 设置为 null
 * @param       {String|ListenerCallback}           [type]                  事件类型，当类型为 function 时视为 callback，将其赋值给 callback，将 type 设置为 null，若 target 不为字符串类型则会报错
 * @param       {ListenerCallback|Object}           [callback={}]           回调函数，当类型为 object 时视为 options，将其赋值给 options，将 callback 设置为 null
 * @param       {Object}                            [options={}]            配置参数与 Listener 参数相同
 * @param       {Boolean}                           [options.useCapture]
 * @param       {Boolean}                           [options.passive]
 * @param       {Boolean}                           [options.useDebounce]
 * @param       {Boolean}                           [options.useThrottle]
 * @return      {Listener}
 * @desc        可以穿四个参数，最少传一个参数，若只传一个参数会视为 type
 * */
var listener = function listener(target, type) {
	var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	var opts = {},
	    ls = void 0;

	if ((typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object') {
		options = callback;
		callback = null;
	}

	if (typeof type === 'function') {
		callback = type;
		type = null;
	}

	if (typeof target === 'string') {
		type = target;
		target = null;
	}

	if (type) {
		opts.type = type;
	}

	if (target) {
		opts.target = target;
	}

	opts = (0, _merge2.default)(opts, options);

	ls = new Listener(opts);

	ls.on();

	if (callback) {
		ls.add(callback);
	}

	return ls;
};

var addHandler = function addHandler(target, eventType, handler) {
	if ('addEventListener' in target) {
		target.addEventListener(eventType, handler, false);
	} else if ('attachEvent' in target) {
		target.attachEvent('on' + eventType, handler);
	} else {
		target['on' + eventType] = handler;
	}
};

exports.Listener = Listener;
exports.listener = listener;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    将 2 个对象合并成一个新的对象
 * */

/**
 * @summary     将 2 个对象合并成一个新的对象
 * @function    merge
 * @memberOf    maple.util
 * @param       {Object}    target
 * @param       {Object}    defaults
 * @return      {object}
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});
var merge = function merge(target, defaults) {
	var temp = Object.keys(defaults).reduce(function (all, d) {

		if (d in target) {
			all[d] = target[d];
		} else {
			all[d] = defaults[d];
		}

		return all;
	}, {});

	return Object.keys(target).reduce(function (all, d) {
		if (!(d in all)) {
			all[d] = target[d];
		}

		return all;
	}, temp);
};

exports.default = merge;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _listener = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @classdesc   数据层基类，将数据保存在内存中
 * @example
let model = new Model();

// 保存数据，以 key-value 的形式保存
model.setData('index/first', true).then(()=>{
	console.log('数据保存成功');
});
// 保存对象
model.setData({
	isLogin: true
	, token: '123123123123123'
	, hybrid: false
}).then(()=>{
	// do something
});

// 获取数据
model.getData('index/first').then((value)=>{
	console.log('获取到数据 ', value);
}, (e)=>{
	console.log('当数据不存在时，reject 传入 null');
});
// 以数组的形式获取数据，返回的数据会被组成一个 Json，若 key 对应的 value 不存在会设为 null
model.getData(['isLogin', 'token', 'hybrid']).then(({isLogin, token, hybrid})=>{
	console.log(isLogin, token, hybrid);    // true, '123123123123123', false
	// 利用 JSON.parse 可以解析出基础类型数据
});
// 获取多个数据的返回结果与数组形式相同
model.getData('isLogin', 'token', 'hybrid').then(({isLogin, token, hybrid})=>{
	//
})
 * */
var Model = function () {
	/**
  * @constructor
  * */
	function Model() {
		var _this = this;

		_classCallCheck(this, Model);

		this._value = Object.create(null); // 不会受到 prototype 的影响，适合用来存储数据，没有 hasOwnProperty、toString 方法
		this._eventList = [];
		this._syncList = [];

		this._listener = (0, _listener.listener)(this, 'modelChange', function (e, topic, value) {
			_this._sync(topic, value);
		});
	}

	// ---------- 静态方法 ----------
	/**
  * @summary 注册子类
  * @static
  * @param   {String}    type
  * @param   {Model}     model
  * @desc    若该子类已经被注册，并且缓存中没有该子类的实例，则覆盖
  * */


	_createClass(Model, [{
		key: '_stringify',


		// ---------- 私有方法 ----------
		/**
   * @summary     转为字符串，会将 null,undefined 转为空字符串
   * @protected
   * @param       {*}     value
   * @return      {String}
   * */
		value: function _stringify(value) {

			if (value === null || value === undefined) {
				value = '';
			}

			return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? JSON.stringify(value) : value.toString();
		}
		/**
   * @summary     触发绑定的数据监控事件
   * @protected
   * @param       {String}    topic
   * @param       {*}         value
   * */

	}, {
		key: '_trigger',
		value: function _trigger(topic, value) {
			this._listener.trigger(topic, value);
		}
		/**
   * @summary     数据同步的内部实现
   * @protected
   * @param       {String}    topic
   * @param       {*}         value
   * */

	}, {
		key: '_sync',
		value: function _sync(topic, value) {
			if (this._syncList.length) {
				Promise.all(this._syncList.map(function (d) {
					var result = void 0;

					if (value !== null) {
						result = d.setData(topic, value);
					} else {
						result = d.removeData(topic);
					}

					result.catch(function (e) {
						console.log(e, d.constructor.name, '同步失败');
					});

					return result;
				})).then(function () {
					console.log('同步完成');
				});
			}
		}

		/**
   * @summary     数据改变事件触发回调函数
   * @callback    ModelChangeEvent
   * @param       {Event}     event
   * @param       {String}    topic
   * @param       {*}         newValue
   * @param       {*}         [oldValue]
   * @desc        函数将传入 topic,newValue 值，当 removeData 执行时也会触发事件，newValue 被传为 null
   *              由于统一使用 Listener 对象，第一个参数将为事件对象，当前事件将传入 {type: modelChange, target: 对象实例}
   * */

		// /**
		//  * @summary     在 Promise resolve 时调用的函数
		//  * @callback    promiseResolve
		//  * @param       {*}     result
		//  * */
		// /**
		//  * @summary     在 Promise reject 时调用的函数
		//  * @callback    promiseReject
		//  * @param       {*}     result
		//  * */
		// /**
		//  * @typedef     {Promise.<Object,Error>}    ModelPromise
		//  * @property    {Object}
		//  * @property    {Object}
		//  * @throws      {Error}
		//  * */

		/**
   * @summary     当 setData 传入一个 json 时内部调用函数
   * @protected
   * @param       {Object}    topic
   * @return      {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: '_setByObject',
		value: function _setByObject(topic) {
			var _this2 = this;

			return Promise.all(Object.keys(topic).map(function (d) {
				return _this2.setData(d, topic[d]);
			})).then(function (data) {
				return !!data;
			});
		}
		/**
   * @summary     当 getData 传入一个数组时内部调用函数
   * @protected
   * @param       {String[]}  topic
   * @return      {Promise}   返回一个 Promise 对象，在 resolve 时传回一个 json，key 为 topic 中的数据，value 为对应查找出来的值
   * @desc        其中如果任何一个 key 没有值，则返回 null
   * */

	}, {
		key: '_getByArray',
		value: function _getByArray(topic) {
			var _this3 = this;

			return Promise.all(topic.map(function (d) {
				return _this3.getData(d).catch(function () {
					return null;
				});
			})).then(function (data) {
				return topic.reduce(function (rs, d, i) {
					rs[d] = data[i];

					return rs;
				}, {});
			});
		}
		/**
   * @summary     当 removeData 传入一个数组时内部调用函数
   * @protected
   * @param       {String[]}  topic
   * @return      {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: '_removeByArray',
		value: function _removeByArray(topic) {
			var _this4 = this;

			return Promise.all(topic.map(function (d) {
				return _this4.removeData(d);
			})).then(function (data) {
				return !!data;
			});
		}

		// ---------- 公有方法 ----------
		/**
   * @summary 绑定数据监视事件
   * @param   {ModelChangeEvent}  callback
   * */

	}, {
		key: 'on',
		value: function on(callback) {
			this._listener.add(callback);
		}
		/**
   * @summary 解除绑定数据监控回调函数
   * @param   {ModelChangeEvent}  callback
   * */

	}, {
		key: 'off',
		value: function off(callback) {
			this._listener.off(callback);
		}
		/**
   * @summary 设置数据
   * @param   {String|Object} topic   主题
   * @param   {*}             [value] 为 null、undefined 时会被保存为空字符串，当 topic 为 object 类型时被忽略
   * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回 true
   * @desc    设置数据的时候会使用 Object.defineProperty 定义该属性
  			目前子类的实现中都调用了 super.setData，若其它子类的实现中并没有调用，但需对数据监控，应在适当的时候调用 _trigger 方法
   * */

	}, {
		key: 'setData',
		value: function setData(topic, value) {
			var _this5 = this;

			var result = void 0;

			if ((typeof topic === 'undefined' ? 'undefined' : _typeof(topic)) === 'object') {
				result = this._setByObject(topic);
			} else {
				if (topic in this._value) {
					this._value[topic] = value;
				} else {
					// // todo 判断是 object 类型的进行深度 defineProperty
					// if( typeof value === 'object' ){
					// 	Object.keys( value ).forEach((d)=>{
					// 		this._setObserver(value[d], d, topic);
					// 	});
					// }

					// console.log('监控', topic, '属性的值');

					/**
      * 不能同时设置访问器 (get 和 set) 和 writable 或 value，否则会报错误
      * configurable 设为 true 才可以使用 delete
      * */
					Object.defineProperty(this._value, topic, {
						enumerable: true,
						configurable: true
						// , value: value
						, set: function set(newVal) {
							console.log('设置', topic, '的值为', newVal);

							if (newVal !== value) {

								_this5._trigger(topic, newVal);
							}
						},
						get: function get() {
							console.log('获取', topic, '的值', value, typeof value === 'undefined' ? 'undefined' : _typeof(value));
							return value;
						}
					});

					this._trigger(topic, value);
				}

				result = Promise.resolve(true);
			}

			return result;
		}
		/**
   * @summary 获取数据
   * @param   {String|String[]|...String} topic
   * @return  {Promise}                   返回一个 Promise 对象，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
   * @desc    当 topic 的类型为数组的时候，resolve 传入的结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值，当传入多个参数时视为传入数组的操作
   * */

	}, {
		key: 'getData',
		value: function getData(topic) {
			var argc = arguments.length,
			    result = void 0;

			if (Array.isArray(topic)) {
				result = this._getByArray(topic);
			} else if (argc > 1) {
				result = this._getByArray([].slice.call(arguments));
			} else {
				if (topic in this._value) {
					result = Promise.resolve(this._value[topic]);
				} else {
					result = Promise.reject(null);
				}
			}

			return result;
		}
		/**
   * @summary 将数据从缓存中删除
   * @param   {String|String[]}   topic
   * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回 true
   * @desc    目前子类的实现中都调用了 super.removeData，若其它子类的实现中并没有调用，但需对数据监控，应在适当的时候调用 _trigger 方法
   * */

	}, {
		key: 'removeData',
		value: function removeData(topic) {
			var result = void 0;

			if (Array.isArray(topic)) {
				result = this._removeByArray(topic);
			} else {
				try {
					if (topic in this._value) {
						// if( this._value.hasOwnProperty(topic) ){

						delete this._value[topic];

						result = Promise.resolve(true);

						this._trigger(topic, null);
						// }
						// else{
						// 	result = Promise.reject( new Error('只能删除自定义属性') );
						// }
					} else {
						// model 中不存在该数据
						result = Promise.resolve(true);

						this._trigger(topic, null);
					}
				} catch (e) {
					result = Promise.reject(e);
				}
			}

			return result;
		}
		/**
   * @summary 清空数据
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: 'clearData',
		value: function clearData() {
			this._value = {};

			return Promise.resolve(true);
		}

		/**
   * @summary 将当前 model 的数据同步到其它 model
   * @param   {Model|Model[]}   model
   * */

	}, {
		key: 'syncTo',
		value: function syncTo(model) {
			var _this6 = this;

			if (!Array.isArray(model)) {
				model = [model];
			}

			model.forEach(function (d) {
				if ((typeof d === 'undefined' ? 'undefined' : _typeof(d)) === 'object' && d instanceof Model && d.constructor !== _this6.constructor && _this6._syncList.indexOf(d) === -1) {

					_this6._syncList.push(d);
				} else {
					// 该实例类型已经存在
					console.log('该实例类型已经存在');
				}
			});
		}
		/**
   * @summary 清除数据同步
   * @param   {Model} model
   * */

	}, {
		key: 'cleanSync',
		value: function cleanSync(model) {
			var i = this._syncList.indexOf(model);

			if (i !== -1) {
				this._syncList.splice(i, 1);
			}
		}
	}], [{
		key: 'register',
		value: function register(type, model) {

			if (type in Model && type in Model._MODEL_CACHE) {
				console.log('type', ' 重复注册，并已生成实例，不能覆盖');
			} else {
				Model[type] = model;
			}
		}
		/**
   * @summary 注册子类的别名
   * @static
   * @param   {String}            type        已注册的子类名
   * @param   {String|String[]}   aliasName   该子类的别名
   * */

	}, {
		key: 'registerAlias',
		value: function registerAlias(type, aliasName) {

			if (!Array.isArray(aliasName)) {
				aliasName = [aliasName];
			}

			aliasName.forEach(function (d) {
				if (!(d in Model._MODEL_ALIAS)) {
					Model._MODEL_ALIAS[d] = type;
				} else {
					console.log(d, ' 已经存在');
				}
			});
		}
		/**
   * @summary 获取或生成 type 类型的 Model 子类的实例或 Model 类的实例
   * @static
   * @param   {String}            [type]
   * @param   {Boolean|Object}    [notCache=false] 为 boolean 类型时表示是否缓存，默认值为 false，设为 true 时既不从缓存中读取子类实例对象，生成的实例对象也不保存在缓存中；为 object 类型时将值赋给 options 并设置为 true
   * @param   {Object}            [options={}]
   * @return  {Model}             当 type 有意义的时候，为 Model 子类类的实例，否则为 Model 类的实例
   * */

	}, {
		key: 'factory',
		value: function factory(type) {
			var notCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var model = void 0;

			if (type) {

				if ((typeof notCache === 'undefined' ? 'undefined' : _typeof(notCache)) === 'object') {
					options = notCache;
					notCache = true;
				}

				// 判断 type 是否为别名
				if (!(type in Model) && type in Model._MODEL_ALIAS) {
					type = Model._MODEL_ALIAS[type];
				}

				// 判断是否存在该子类
				if (type in Model) {

					if (notCache || !(type in Model._MODEL_CACHE)) {
						// 不使用缓存或没有该子类实例

						model = new Model[type](options);

						if (!notCache) {

							// 使用缓存，将该子类实例缓存
							Model._MODEL_CACHE[type] = model;

							console.log('通过工厂方法生成', type, '类型的对象', '将', type, '类型的对象缓存');
						}
					} else {
						// 使用缓存并存在该子类实例
						model = Model._MODEL_CACHE[type];

						console.log('从缓存中取到', type, '类型的对象');
					}
				} else {
					model = new Model();

					console.log('不存在注册为 ', type, ' 的子类');
				}
			} else {
				model = new Model();

				console.log('生成 model 对象');
			}

			return model;
		}
	}]);

	return Model;
}();

// ---------- 静态属性 ----------
/**
 * 子类对象缓存
 * @static
 * */


Model._MODEL_CACHE = {};
/**
 * 子类别名列表
 * @static
 * */
Model._MODEL_ALIAS = {};

exports.default = Model;

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

module.exports = undefined;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {/*!
 * Vue.js v2.4.4
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */


/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(val);
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = (null); // work around flow check

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (parentVal, childVal) {
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options) {
  var inject = options.inject;
  if (Array.isArray(inject)) {
    var normalized = options.inject = {};
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = inject[i];
    }
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child);
  normalizeInject(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  if (deep && vnode.children) {
    cloned.children = cloneVNodes(vnode.children);
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  var plain = !(passive || once$$1 || capture);
  return {
    name: name,
    plain: plain,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

// #6552
function prioritizePlainEvents (a, b) {
  return a.plain ? -1 : b.plain ? 1 : 0
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  var toAdd = [];
  var hasModifier = false;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (!event.plain) { hasModifier = true; }
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      event.handler = cur;
      toAdd.push(event);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  if (toAdd.length) {
    if (hasModifier) { toAdd.sort(prioritizePlainEvents); }
    for (var i = 0; i < toAdd.length; i++) {
      var event$1 = toAdd[i];
      add(event$1.name, event$1.handler, event$1.once, event$1.capture, event$1.passive);
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        (last).text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (comp.__esModule && comp.default) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      data && data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure((name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function checkOptionType (vm, name) {
  var option = vm.$options[name];
  if (!isPlainObject(option)) {
    warn(
      ("component option \"" + name + "\" should be an object."),
      vm
    );
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      if (isReservedAttribute(key) || config.isReservedAttr(key)) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'computed');
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'methods');
  var props = vm.$options.props;
  for (var key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'watch');
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(function (key) {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (process.env.NODE_ENV !== 'production' && !source) {
        warn(("Injection \"" + key + "\" not found"), vm);
      }
    }
    return result
  }
}

/*  */

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    data: data,
    props: props,
    children: children,
    parent: context,
    listeners: data.on || emptyObject,
    injections: resolveInject(Ctor.options.inject, context),
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    vnode.functionalOptions = Ctor.options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && isUndef(child.ns)) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      props = extend(extend({}, bindObject), props);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && process.env.NODE_ENV !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] =
    this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(ours, existing) : ours;
      }
    }
  }
  return data
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', vm.$options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive$$1(vm, '$listeners', vm.$options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        if (slot._rendered) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        vnode = vm.$options.renderError
          ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          : vm._vnode;
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
  Vue.prototype._g = bindObjectListeners;
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-init:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp, Array];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (cache, current, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, this._vnode, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, this._vnode, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.4.4';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.elm = elm;
      vnode.isAsyncPlaceholder = true;
      return true
    }
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed
              ) {
                bailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed
              ) {
                bailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            }
            ancestor = ancestor.parent;
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (modelRs.exp) + ", " + (modelRs.idx) + ", " + assignment + ")")
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;

function parseModel (val) {
  str = val;
  len = str.length;
  index$1 = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (process.env.NODE_ENV !== 'production') {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$1(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, CHECKBOX_RADIO_TOKEN,
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + value + "=$$a.concat([$$v]))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  var event;
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  if (once$$1) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$options._renderChildren;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (process.env.NODE_ENV !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if (process.env.NODE_ENV !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

// check whether current browser encodes a char inside attribute values
function shouldDecode (content, encoded) {
  var div = document.createElement('div');
  div.innerHTML = "<div a=\"" + content + "\"/>";
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if (process.env.NODE_ENV !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

var modules$1 = [
  klass$1,
  style$1
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        process.env.NODE_ENV !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints (el) {
        if (process.env.NODE_ENV !== 'production') {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (process.env.NODE_ENV !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      process.env.NODE_ENV !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (process.env.NODE_ENV !== 'production') {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      addAttr(el, 'slot', slotTarget);
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (process.env.NODE_ENV !== 'production') {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    var handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (process.env.NODE_ENV !== 'production' &&
      name === 'click' &&
      handler && handler.modifiers && handler.modifiers.right
    ) {
      warn(
        "Use \"contextmenu\" instead of \"click.right\" since right clicks " +
        "do not actually fire \"click\" events."
      );
    }
    res += "\"" + name + "\":" + (genHandler(name, handler)) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var alias = keyCodes[key];
  return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

/*  */

function on (el, dir) {
  if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      process.env.NODE_ENV !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if (process.env.NODE_ENV !== 'production' && (
    el.children.length > 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  return "{key:" + key + ",fn:function(" + (String(el.attrsMap.scope)) + "){" +
    "return " + (el.tag === 'template'
      ? genChildren(el, state) || 'void 0'
      : genElement(el, state)) + "}}"
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
      );
    } else {
      errors.push(("invalid expression: " + (text.trim())));
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = options || {};

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        warn(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(((this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

module.exports = Vue$3;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), __webpack_require__(15)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _maple = __webpack_require__(16);

var _maple2 = _interopRequireDefault(_maple);

var _index = __webpack_require__(45);

var api = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var z = _maple2.default;

z.api = api;

exports.default = z;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    防抖函数
 *          保证函数只在固定时间内最后一次触发才执行
 * */

/**
 * @summary     防抖函数
 * @function    debounce
 * @memberOf    maple.util
 * @param       {Function}  func
 * @param       {Number}    wait
 * @param       {Function}  cancelCB    上一次计时器取消时调用
 * @return      {Function}
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});
var debounce = function debounce(func, wait, cancelCB) {
	var timeout = null,
	    result = function result() {
		var that = this || null,
		    argv = [].slice.call(arguments);

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(function () {
			func.apply(that, argv || []);
		}, wait);
	};

	/**
  * 取消计时器
  * */
	result.cancel = function () {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;

			cancelCB && cancelCB();
		}
	};

	/**
  * 立刻调用函数
  * */
	result.immediate = function () {
		var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var argv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		result.cancel();

		func.apply(context, argv);
	};

	return result;
};

exports.default = debounce;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    节流函数
 *          保证一个函数在固定的时间内只执行一次
 * */

/**
 * @summary     节流函数
 * @function    throttle
 * @memberOf    maple.util
 * @param       {Function}  func
 * @param       {Number}    wait
 * @param       {Function}  cancelCB    当前操作无法执行时的回调函数
 * @return      {Function}
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});
var throttle = function throttle(func, wait, cancelCB) {
	var timeout = null,
	    result = function result() {
		var that = this || null,
		    argv = [].slice.call(arguments);

		if (!timeout) {
			func.apply(that, argv || []);

			timeout = setTimeout(function () {
				clearTimeout(timeout);
				timeout = null;
			}, wait);
		}
	};

	/**
  * 取消计时器
  * */
	result.cancel = function () {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;

			cancelCB && cancelCB();
		}
	};

	/**
  * 取消定时器，立即执行
  * @param   {Object}    [context=null]  执行函数时的 this 指向
  * @param   {Array}     [argv=[]]       执行函数时的传入参数
  * */
	result.immediate = function () {
		var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var argv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		result.cancel();

		func.apply(context, argv);

		timeout = setTimeout(function () {
			clearTimeout(timeout);
			timeout = null;
		}, wait);
	};

	return result;
};

exports.default = throttle;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    时间格式处理函数
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _tools = __webpack_require__(10);

var _tools2 = _interopRequireDefault(_tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @summary     时间格式处理函数
 * @function    dateFormat
 * @memberOf    maple.util
 * @param       {Date}      [date=new Date()]
 * @param       {String}    [format='YYYY-MM-DD']
 * @return      {String}
 * */
var dateFormat = function dateFormat() {
	var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
	var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD';

	return format.replace(/YYYY|YY|MM|DD|hh|mm|ss|星期|周|www|week/, function (str) {
		return str in dateFormat._dateStrReplace ? dateFormat[str](date) : '';
	});
};

/**
 * 时间格式字符串替换函数集合
 * */
dateFormat._dateStrReplace = {
	/**
  * @summary 替换 YYYY
  * @param   {Date}      date
  * @return  {String}
  * */
	YYYY: function YYYY(date) {
		return date.getFullYear() + '';
	}
	/**
  * @summary 替换 YY
  * @param   {Date}      date
  * @return  {String}
  * */
	,
	YY: function YY(date) {
		return (date.getFullYear() + '').slice(2);
	}
	/**
  * @summary 替换 MM
  * @param   {Date}      date
  * @return  {String}
  * */
	,
	MM: function MM(date) {
		return _tools2.default.fillZero(date.getMonth() + 1, 2);
	}
	/**
  * @summary 替换 DD
  * @param   {Date}      date
  * @return  {String}
  * */
	,
	DD: function DD(date) {
		return _tools2.default.fillZero(date.getDate(), 2);
	}
	/**
  * @summary 替换 hh
  * @param   {Date}      date
  * @return  {String}
  * */
	,
	hh: function hh(date) {
		return _tools2.default.fillZero(date.getHours(), 2);
	}
	/**
  * @summary 替换 mm
  * @param   {Date}      date
  * @return  {String}
  * */
	,
	mm: function mm(date) {
		return _tools2.default.fillZero(date.getMinutes(), 2);
	}
	/**
  * @summary 替换 ss
  * @param   {Date}      date
  * @return  {String}
  * */
	,
	ss: function ss(date) {
		return _tools2.default.fillZero(date.getSeconds(), 2);
	}
	/**
  * @summary 替换 www
  * @param   {Date}      date
  * @return  {String}
  * */
	,
	www: function www(date) {
		return dateFormat._WEEK_EN[date.getDay()].slice(0, 3);
	}
	/**
  * @summary 替换 week
  * @param   {Date}      date
  * @return  {String}
  * */
	,
	week: function week(date) {
		return dateFormat._WEEK_EN[date.getDay()];
	}
	/**
  * @summary 替换星期
  * @param   {Date}      date
  * @return  {String}
  * */
	,
	'星期': function _(date) {
		return '星期' + dateFormat._WEEK_CN[date.getDay()];
	}
	/**
  * @summary 替换周
  * @param   {Date}      date
  * @return  {String}
  * */
	, '周': function _(date) {
		return '周' + dateFormat._WEEK_CN[date.getDay()];
	}
};

/**
 * @summary 将字符串或数字转成毫秒数
 * @param   {Number|String} str
 * @param   {String}        [unit='d']
 * @return  {Number}
 * */
dateFormat.formatTimeStr = function (str) {
	var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'd';

	var result = 0,
	    temp = void 0;

	if (typeof str === 'number') {
		if (unit && unit in dateFormat._SHORT_TIME_NUM) {
			result = str * dateFormat._SHORT_TIME_NUM[unit];
		} else {
			result = str;
		}
	} else if (typeof str === 'string' && (temp = dateFormat._SHORT_TIME_EXPR.exec(str))) {
		result = Number(temp[1]) * (dateFormat._SHORT_TIME_NUM[temp[2]] || 1);
	}

	return result;
};
/**
 * 英文一周名称
 * */
dateFormat._WEEK_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/**
 * 中文一周名称
 * */
dateFormat._WEEK_CN = ['日', '一', '二', '三', '四', '五', '六'];

/**
 * 简短时间设置格式
 * @const
 * @static
 * */
dateFormat._SHORT_TIME_EXPR = /^(-?\d+)(s|m|h|d|y)?$/i;
/**
 * 时间单位对应的毫秒数
 * @const
 * @static
 * */
dateFormat._SHORT_TIME_NUM = {
	s: 1e3,
	m: 6e4,
	h: 36e5,
	d: 864e5,
	y: 31536e6
};

exports.default = dateFormat;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @namespace   maple.util.tools
 * */

/**
 * @summary     将数字转成字符串在前面补 0
 * @function    fillZero
 * @memberOf    maple.util.tools
 * @param       {Number|String} str
 * @param       {Number}        len
 * @return      {String}
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});
var fillZero = function fillZero(str, len) {
	var i = void 0;

	str += '';

	if (len > str.length) {
		for (i = str.length; i < len; i++) {
			str = '0' + str;
		}
	}

	return str;
};

exports.default = {
	fillZero: fillZero
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    获取当前页面路径参数，并提供页面跳转方法
 *          整合 location 和 history 功能
 * */

// const PARAMS_FILTER = [
// 		'10000skip' // 微信下 10000skip
// 	]
// 	;

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(19);

var _config2 = _interopRequireDefault(_config);

var _listener = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @classdesc   url 解析
 * */
var Url = function () {
	/**
  * @constructor
  * @param   {String}    [url]
  * */
	function Url(url) {
		_classCallCheck(this, Url);

		var a = document.createElement('a', _config2.default.ceKey);

		a.href = url || location.href;

		this.source = a.href;
		this.protocol = a.protocol.replace(':', '');
		this.origin = a.origin;
		this.host = a.hostname;
		this.port = a.port;
		this.path = a.pathname.replace(/^([^\/])/, '$1');
		// 相对路径
		this.relative = (a.href.match(/tps?:\/\/[^\/]+(.*)/) || ['', ''])[1];
		// 当前页面文件名
		this.file = (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1];
		// 当前页面目录
		this.dir = this.path.replace(this.file, '');
		// todo ?
		this.segments = a.pathname.replace(/^\//, '').split('/');
		// 参数对象
		this.params = this.parseSearch(a.search);
		// hash
		this.hash = a.hash.slice(1);
		// 页面来源
		this.from = document.referrer;

		a = null; // 释放内存
	}

	// ---------- 公有属性 ----------


	_createClass(Url, [{
		key: 'parseSearch',


		// ---------- 公有方法 ----------
		/**
   * @summary     解析 url 的 search 部分
   * @param       {String}    [search='']
   * @return      {Object}
   * */
		value: function parseSearch() {
			var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			if (search && /^\?/.test(search)) {
				search = search.slice(1);
			}

			return search ? search.split('&').reduce(function (all, d) {
				var temp = void 0;

				if (d) {
					temp = d.split('=');

					// 解码
					all[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1] || '').replace(/\?10000skup(=true)?/, ''); // 删除微信下的?10000skip todo ?
				}

				return all;
			}, {}) : {};
		}

		/**
   * @summary     将现有参数组合成一个 url
   * @return      {String}
   * @todo        onlyPath 参数保留？
   * */

	}, {
		key: 'pack',
		value: function pack() {
			return this.protocol + '://' + this.host + (!this.port || this.port === '80' ? '' : ':' + this.port) + this.path + this.query + (this.hash ? '#' + this.hash : '');
		}
		/**
   * @summary     替换当前的 params
   * @param       {Object|String[]|...String} params
   * @return      {Object}                    this
   * @desc        当为多个 string 时，为删除当前 url 上参数，当为 object 时为设置当前 url 上参数
   * */

	}, {
		key: 'changeParams',
		value: function changeParams(params) {
			var _this = this;

			var argv = void 0;

			if (typeof params === 'string') {
				argv = [].slice.call(arguments);
			} else {
				argv = params;
			}

			if (Array.isArray(argv)) {
				argv.forEach(function (d) {
					if (typeof d === 'string') {
						delete _this.params[d];
					}
				});
			} else if ((typeof argv === 'undefined' ? 'undefined' : _typeof(argv)) === 'object') {
				Object.keys(argv).forEach(function (d) {
					_this.params[d] = params[d];
				});
			}

			return this;
		}
	}, {
		key: 'query',
		get: function get() {
			var _this2 = this;

			// 当前页面参数拼接字符串
			var query = Object.keys(this.params).reduce(function (all, d) {
				all.push(encodeURIComponent(d) + '=' + encodeURIComponent(_this2.params[d]));

				return all;
			}, []);

			return query.length ? '?' + query.join('&') : '';
		}
	}]);

	return Url;
}();

var url = new Url();

/**
 * @summary     Url 类对象
 * @type        {Url}
 * @memberOf    url
 *
 * */
url.Url = Url;
/**
 * @summary     对 url 进行解析
 * @method
 * @memberOf    url
 * @param       {String|Url}    url
 * @return      {Url}           若出入的 url 参数是一个 Url 对象，则不做处理直接返回
 * */
url.parseUrl = function (url) {
	if (url instanceof Url) {
		return url;
	} else if (typeof url === 'string') {
		return new Url(url);
	} else {
		return new Url();
	}
};
/**
 * @summary     对没有协议头（以 // 开头）的路径加上协议头
 * @method
 * @memberOf    url
 * @param       {String}    url
 * @return      {String}
 * */
url.addProtocol = function (url) {
	return (/^\/\//.test(url) ? location.protocol + url : url
	);
};
/**
 * @summary     刷新当前页面
 * @method
 * @memberOf    url
 * */
url.reload = function () {
	location.reload();
};
/**
 * @summary     页面后退
 * @method
 * @memberOf    url
 * */
url.back = function () {
	history.back();
};
/**
 * @summary     调整参数并指向调整后的路径，当前 url 添加到历史记录
 * @method
 * @memberOf    url
 * @param       {Object|String[]|...String} params
 * @param       {*|Object}                  [pushState]
 * @return      {Url}                       this
 * @desc        只有两种情况下 pushState 才有效：
 *              1.当 params 是 Object 类型时
 *              2.当不满足 1 条件时，参数中的最后一个为 Object 类型时，视为 pushState
 * */
url.push = function (params, pushState) {
	var argc = arguments.length,
	    argv = arguments,
	    state = null;

	if (argc > 1) {
		if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
			state = arguments[1];
		} else if (_typeof(arguments[argc - 1]) === 'object') {
			state = arguments[argc - 1];
			argv = [].slice.call(arguments, 0, -1);
		}
	}

	this.changeParams.apply(this, _toConsumableArray(argv));

	// 将当前浏览器上 url 换为替换后组装出来的链接，当期 url 进入
	history.pushState(state, '', this.pack());

	return this;
};
/**
 * @summary     将 url 指向目标路径，当前 url 添加到历史记录
 * @method
 * @memberOf    url
 * @param       {String}    href
 * @param       {Object}    [state=null]
 * @return      {Url}       this
 * */
url.pushHistory = function (href) {
	var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	history.pushState(state, '', href);

	return this;
};
/**
 * @summary     跳转到目标页面，当前 url 添加到历史记录
 * @method
 * @memberOf    url
 * @param       {String}    href
 * */
url.changePage = function (href) {
	location.assign(href);
};
/**
 * @summary     替换当前 url 上的参数
 * @method
 * @memberOf    url
 * @param       {Object|String[]|...String} params
 * @return      {Url}                       this
 * */
url.replace = function (params) {
	this.changeParams.apply(this, arguments);

	// 将当前浏览器上 url 换为替换后组装出来的链接
	history.replaceState(null, '', this.pack());

	return this;
};
/**
 * @summary     替换当前 url 为目标路径
 * @method
 * @memberOf    url
 * @param       {String}    href
 * @param       {Object}    [state=null]
 * @return      {Url}       this
 * */
url.replaceHistory = function (href) {
	var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	history.replaceState(state, '', href);

	return this;
};
/**
 * @summary     替换当前 url 为目标路径，页面刷新
 * */
url.replacePage = function (href) {
	location.replace(href);
};
/**
 * @summary     监听 hashChange 事件
 * @type        {Listener}
 * @memberOf    url
 * */
url.hashChange = (0, _listener.listener)('hashchange', function (e, newUrl) {
	var temp = void 0;

	if (e.newUrl) {
		temp = url.parseUrl(e.newUrl);
	} else if (newUrl) {
		temp = url.parseUrl(newUrl);
	}

	if (temp) {
		url.hash = temp.hash;
	}
});
/**
 * @summary     监听 popstate 事件
 * @type        {Listener}
 * @memberOf    url
 * */
url.popState = (0, _listener.listener)('popstate', function (e, newUrl) {
	var temp = void 0,
	    state = e.state;

	if (newUrl) {
		temp = url.parseUrl(newUrl);
	} else {
		temp = url.parseUrl(location.href);
	}

	if (typeof state === 'string') {
		try {
			state = JSON.parse(state);
		} catch (e) {}
	}

	// todo state 做什么？
	console.log(state);

	// 替换当期 url 对象属性 todo 更好的实现？
	Object.keys(temp).forEach(function (k) {
		url[k] = temp[k];
	});
});

/**
 * @exports     url
 * @type        {Object}
 * @memberOf    maple
 * */
exports.default = url;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @class   Animator
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animator = function () {
	/**
  * @constructor
  * @param   {Number}            duration            运行时间，单位毫秒
  * @param   {Function}          progress            运行操作
  * @param   {String|Function}   [easing='linear']   变化速率
  * */
	function Animator(duration, progress) {
		var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';

		_classCallCheck(this, Animator);

		this.duration = duration;
		this.progress = progress;

		this._animate = null;

		// 设置动画变化速率
		if (typeof easing === 'function') {
			this.easing = easing;
		} else if (typeof easing === 'string' && easing in Animator.timing) {
			this.easing = Animator.timing[easing];
		} else {
			this.easing = Animator.timing.linear;
		}
	}

	/**
  * @param   {Boolean|Function}  [finished]  Boolean 值时表示是否继续运行，Function 时为运行结束的回调函数
  * @desc    运行动画
  * */


	_createClass(Animator, [{
		key: 'run',
		value: function run(finished) {
			var startTime = Date.now(),
			    duration = this.duration,
			    self = this;

			this._animate = requestAnimationFrame(function step() {
				var p = (Date.now() - startTime) / duration,
				    next = true;

				if (p < 1.0) {
					self.progress(self.easing(p), p);
				} else {
					if (typeof finished === 'function') {
						next = finished() === false;
					} else {
						next = finished === false;
					}

					if (!next) {
						self.progress(self.easing(1.0), 1.0);
					} else {
						startTime += duration;
						self.progress(self.easing(p), p);
					}
				}

				if (next) {
					self._animate = requestAnimationFrame(step);
				} else {
					self._animate = null;
				}
			});
		}
		/**
   * @desc    停止动画
   * */

	}, {
		key: 'stop',
		value: function stop() {
			if (this._animate) {
				cancelAnimationFrame(this._animate);

				this._animate = null;
			}
		}

		/**
   * @desc    将动画代码渲染为 CSS 动画
   * */

	}, {
		key: 'renderCSS',
		value: function renderCSS() {}
	}]);

	return Animator;
}();

Animator.timing = {
	linear: function linear(p) {
		return p;
	},
	easing: function easing(p) {},
	easingIn: function easingIn(p) {},
	easingInOut: function easingInOut(p) {},
	easingOut: function easingOut(p) {}
};

exports.default = Animator;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
__webpack_require__(5);
module.exports = __webpack_require__(6);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    基础框架聚合
 *          模块聚合关系如下：
<pre>
 +-----------------------------------------------------------+
 |                                                           |
 |             Maple( base.js )                              |
 |                                                           |
 |  +-------+  +----------+  +------------+  +------------+  |
 |  |       |  |          |  |            |  |            |  |
 |  |  url  |  |  device  |  |  listener  |  |  util      |  |   运行环境检测 & 基础工具函数
 |  |       |  |          |  |            |  |            |  |
 |  +-------+  +----------+  +------------+  +----------- +  |
 |                                                           |
-----------------------------------------------------------------------
 |                                                           |
 |  +--------------+  +---------------+  +----------------+  |
 |  |              |  |               |  |                |  |
 |  |  model       |  |  view         |  |  router        |  |   Model 数据处理 & View 视图处理 & router 路由配置
 |  |              |  |               |  |                |  |
 |  +--------------+  +---------------+  +----------------+  |
 |                                                           |
-----------------------------------------------------------------------
 |                                                           |
 |  +------------+  +------------+  +----------+             |
 |  |            |  |            |  |          |             |
 |  |  position  |  |  register  |  |  notify  |             |  浏览器增强功能
 |  |            |  |            |  |          |             |
 |  +------------+  +------------+  +----------+             |
 |                                                           |
 +-----------------------------------------------------------+
</pre>
 * */

// /**
//  * 基于 jQuery Deferred 对象简易实现 Promise，主要针对 UC 浏览器
//  * @todo    期望改为根据全局环境动态加载
//  * */
// import './promise.js';
// import 'es6-promise/auto';

/**
 * @namespace   maple
 * */

/**
 * ---------- 事件队列监听 ----------
 * */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _listener = __webpack_require__(0);

var _index = __webpack_require__(17);

var _index2 = _interopRequireDefault(_index);

var _url = __webpack_require__(11);

var _url2 = _interopRequireDefault(_url);

var _device = __webpack_require__(20);

var _device2 = _interopRequireDefault(_device);

var _index3 = __webpack_require__(21);

var _index4 = _interopRequireDefault(_index3);

var _index5 = __webpack_require__(30);

var _index6 = _interopRequireDefault(_index5);

var _index7 = __webpack_require__(37);

var _index8 = _interopRequireDefault(_index7);

var _position = __webpack_require__(38);

var _position2 = _interopRequireDefault(_position);

var _index9 = __webpack_require__(39);

var animate = _interopRequireWildcard(_index9);

var _index10 = __webpack_require__(41);

var _index11 = _interopRequireDefault(_index10);

var _notify = __webpack_require__(44);

var _notify2 = _interopRequireDefault(_notify);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ---------- Router 路由控制 ----------
 * */


/**
 * ---------- 数据层 ----------
 * */


/**
 * ---------- 全局运行时检测 ----------
 * */
// 运行参数
var maple = {
  Listener: _listener.Listener,
  listener: _listener.listener,
  util: _index2.default,

  url: _url2.default,
  device: _device2.default,

  Model: _index4.default,
  model: _index4.default,

  view: _index6.default,

  router: _index8.default,

  position: _position2.default

  // 实验性功能
  , animate: animate,
  register: _index11.default,
  notify: _notify2.default
};

/**
 * ---------- 获取地理位置 ----------
 * */


/**
 * ---------- View 监控对象 ----------
 * */


// 运行设备、系统、内核、浏览器


/**
 * ---------- 通用工具 ----------
 * */


window.maple = maple;

exports.default = maple;

/**
 * todo 实验性功能
 * */

/**
 * ---------- 动画库 ----------
 * */


/**
 * ---------- 注册后台 worker ----------
 * */


/**
 * ---------- 桌面通知 ----------
 * */

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    工具函数聚合页面
 * */

/**
 * @namespace   maple.util
 * */

// 操作类

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _debounce = __webpack_require__(7);

var _debounce2 = _interopRequireDefault(_debounce);

var _throttle = __webpack_require__(8);

var _throttle2 = _interopRequireDefault(_throttle);

var _lockup = __webpack_require__(18);

var _lockup2 = _interopRequireDefault(_lockup);

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

var _dateFormat = __webpack_require__(9);

var _dateFormat2 = _interopRequireDefault(_dateFormat);

var _tools = __webpack_require__(10);

var _tools2 = _interopRequireDefault(_tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 时间格式处理
exports.default = {
	debounce: _debounce2.default,
	throttle: _throttle2.default,
	lockup: _lockup2.default,

	merge: _merge2.default,
	dateFormat: _dateFormat2.default
	// , validate
	, tools: _tools2.default
};

// 验证
// import validate     from './validate.js';

// 工具函数


// 数据处理类

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    锁定函数
 *          当函数运行时，其它操作将无法运行函数，直到将锁解除
 * */

/**
 * @summary     锁定操作函数
 * @function    lockup
 * @memberOf    maple.util
 * @param       {Function}  func
 * @return      {Function}
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});
var lockup = function lockup(func) {
	var result = function result() {

		if (result._enable) {
			result._enable = false;

			return func.apply(null, arguments);
		}
	};

	result._enable = true;

	result.clear = function () {
		result._enable = true;
	};

	return result;
};

exports.default = lockup;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    全局配置
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	dev: {},
	test: {},
	pre: {},
	online: {},
	ceKey: ''
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    识别当前运行设备
 * @todo    评估一下是否有用，基本上只用到判断是否为微信，判断 app 使用了 cookie。。。
 * */

// import $    from 'jquery';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var alias = {
	androidchorme: 'androidchrome',
	guge: 'chrome',
	webview: 'webView',
	minimalui: 'minimalUi',
	statusbar: 'statusBar',
	pixelratio: 'pixelRatio',
	wechat: 'weixin',
	wx: 'weixin'
},
    ua = navigator.userAgent;

/**
 * @summary     判断当前设备是否满足期望
 * @function
 * @param       {...String}
 * @return      {Boolean}
 * @desc        可以传多个参数，当同时满足时，返回 true，否则 false
 * */
var device = function device() {
	var argc = arguments.length,
	    result = true,
	    i = void 0,
	    temp = void 0;

	if (argc === 0) {
		result = false;
	} else {
		for (i = 0; i < argc; i++) {

			temp = arguments[i];

			if (temp in device && device.hasOwnProperty(temp)) {
				result = result && device[temp];
			} else {
				temp = temp.toLowerCase();

				if (temp in alias) {
					result = result && device[alias[temp]];
				} else {
					result = result && false;
				}
			}

			if (!result) {
				break;
			}
		}
	}

	return result;
};

var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

// Chrome
device.chrome = ua.toLowerCase().indexOf('chrome') >= 0;

// Android
if (android) {
	device.os = 'android';
	device.osVersion = android[2];
	device.android = true;
	device.androidChrome = device.android && device.chrome;
}

// iOS
if (ipad || iphone || ipod) {
	device.os = 'ios';
	device.ios = true;
}
if (iphone && !ipod) {
	device.osVersion = iphone[2].replace(/_/g, '.');
	device.iphone = true;
}
if (ipad) {
	device.osVersion = ipad[2].replace(/_/g, '.');
	device.ipad = true;
}
if (ipod) {
	device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	device.iphone = true;
}
// iOS 8+ changed UA
if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
	if (device.osVersion.split('.')[0] === '10') {
		device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
	}
}

// WebView
device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

// // todo iOS8 移除了 minimal-ui 删掉？
// // Minimal UI
// if (device.os && device.os === 'ios') {
// 	let osVersionArr = device.osVersion.split('.')
// 		, $metaViewport = $('meta[name="viewport"]')
// 		;
// 	device.minimalUi = !device.webView &&
// 		(ipod || iphone) &&
// 		(osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
// 		$metaViewport.length > 0 &&
// 		$metaViewport.attr('content').indexOf('minimal-ui') >= 0;
// }

// Check for status bar and fullscreen app mode
var windowHeight = document.documentElement.clientHeight,
    windowWidth = document.documentElement.clientWidth;

device.statusBar = device.webView && windowWidth * windowHeight === screen.width * screen.height;

// Pixel Ratio
device.pixelRatio = window.devicePixelRatio || 1;

// 微信，坑..
device.wechat = device.weixin = /MicroMessenger/i.test(ua);

// UC 浏览器
device.uc = ua.indexOf('UCBrowser') > -1;

// 支付宝
device.alipay = ua.indexOf("AlipayClient") > 0;

/**
 * @exports     device
 * @type        {Object}
 * @memberOf    maple
 * */
exports.default = device;

// /**
//  * todo 更换位置
//  * */
// let classNames = [];
//
// classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
// if( device.pixelRatio >= 2 ){
// 	classNames.push('retina');
// }
//
// // OS classes
// if( device.os ){
// 	classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
// 	if( device.os === 'ios'){
// 		let major = parseInt(device.osVersion.split('.')[0], 10);
// 		for (let i = major - 1; i >= 6; i--) {
// 			classNames.push('ios-gt-' + i);
// 		}
// 	}
//
// }
// // Status bar classes
// if( device.statusBar ){
// 	classNames.push('with-statusbar-overlay');
// }
// else{
// 	$('html').removeClass('with-statusbar-overlay');
// }
//
// // Add html classes
// if( classNames.length > 0 ){
// 	$('html').addClass(classNames.join(' '));
// }

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    数据层
 *          统一临时数据、本地缓存、服务器接口的调用，数据调用统一为 setData、getData、removeData、clearData 接口，也可继承相关的类，自定义实现接口
 *          当前继承关系
<pre>
                                    +---------+
                                    |         |
                                    |  Model  |
                                    |         |
                                    +----+----+
                                         |
                                         |
         +---------+-------------+-------+-----+---------+---------+------------+
         |         |             |             |         |         |            |
         |         |             |             |         |         |            |
         |         |             |             |         |         |            |
         v         |             v             |         v         |            v
 +-------+-------+ | +-----------+-----------+ | +-------+-------+ | +----------+----------+
 |               | | |                       | | |               | | |                     |
 |  CookieModel  | | |  SessionStorageModel  | | |  WebSQLModel  | | |  CacheStorageModel  |
 |               | | |                       | | |               | | |                     |
 +---------------+ | +-----------------------+ | +---------------+ | +---------------------+
                   |                           |                   |
                   |                           |                   |
                   |                           |                   |
                   v                           v                   v
         +---------+-----------+   +-----------+------+   +--------+-------+
         |                     |   |                  |   |                |
         |  LocalStorageModel  |   |  IndexedDBModel  |   |  ServiceModel  |
         |                     |   |                  |   |                |
         +---------------------+   +------------------+   +----------------+
</pre>
 * */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = __webpack_require__(2);

var _model2 = _interopRequireDefault(_model);

__webpack_require__(22);

__webpack_require__(23);

__webpack_require__(24);

__webpack_require__(25);

__webpack_require__(26);

__webpack_require__(27);

__webpack_require__(29);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * post message
 * todo 功能用途？
 * */

// 网络请求
exports.default = _model2.default;

// 缓存

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _model = __webpack_require__(2);

var _model2 = _interopRequireDefault(_model);

var _dateFormat = __webpack_require__(9);

var _dateFormat2 = _interopRequireDefault(_dateFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 * @classdesc   对 cookie 的使用进行封装，统一调用接口，在 Model.factory 工厂方法注册为 cookie，别名 c，将可以使用工厂方法生成
 * @extends     Model
 * @example
</pre>
let cookieModel = new CookieModel()
	, cookie = Model.factory('cookie')
    , c = Model.factory('c')
	;

console.log( cookie === c );    // 因为将对象实例进行了缓存，所以结果为 true

cookie.set('memberId', 1, '30d');   // 将 memberId 放入 cookie 中，过期时间 30 天
</pre>
 * */
var CookieModel = function (_Model) {
	_inherits(CookieModel, _Model);

	/**
  * @constructor
  * */
	function CookieModel() {
		_classCallCheck(this, CookieModel);

		var _this = _possibleConstructorReturn(this, (CookieModel.__proto__ || Object.getPrototypeOf(CookieModel)).call(this));

		if (navigator.cookieEnabled) {
			_this._enabled = true;
			_this._store = Promise.resolve(true);
		} else {
			_this._enabled = false;
			_this._store = Promise.reject(new Error('此浏览器不支持 Cookie'));
		}
		return _this;
	}

	// ---------- 静态方法 ----------
	/**
  * @summary 转换时间数据格式
  * @static
  * @param   {Date|Number|String}    date 为 Number 类型时默认单位为天
  * @return  {String}                返回一个 UTC 格式的时间字符串
  * */


	_createClass(CookieModel, [{
		key: '_setCookie',


		// ---------- 私有方法 ----------
		/**
   * @summary     设置 cookie
   * @protected
   * @param       {String}                topic
   * @param       {*}                     value
   * @param       {Object|Number|String}  [options]           相关配置
   * @param       {String}                [options.path]
   * @param       {String}                [options.domain]
   * @param       {Date|Number|String}    [options.expires]
   * @param       {String}                [options.secure]
   * @return      {Boolean}               在设置完成后返回 true
   * @desc        因为设置 cookie 和删除 cookie 使用是相同的代码，只是传入的过期时间不同，所以提出一个共通方法
   * */
		value: function _setCookie(topic, value, options) {
			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
				options = {
					expires: options
				};
			}

			if (options.expires) {
				options.expires = CookieModel._transDate(options.expires);
			}

			document.cookie = encodeURIComponent(topic) + '=' + encodeURIComponent(this._stringify(value)) + Object.keys(CookieModel._DEFAULT).reduce(function (a, d) {
				// 整理配置

				a += '; ' + d + '=';

				if (d in options) {
					a += options[d];
				} else {
					a += CookieModel._DEFAULT[d];
				}

				return a;
			}, '');

			return true;
		}
		/**
   * @summary     设置 cookie
   * @protected
   * @param       {String|String[]}   topic
   * @return      {Object|String}
   * */

	}, {
		key: '_getCookie',
		value: function _getCookie(topic) {
			var cookies = document.cookie,
			    i = 0,
			    l = void 0,
			    value = '',
			    t = void 0;

			if (cookies) {
				cookies = cookies.split('; ');
			} else {
				cookies = [];
			}

			/**
    * todo 调整机制
    *
    * 现在每次取值，都会将 cookie 进行一次解析
    * 期望改为只解析一次
    * */
			for (l = cookies.length; i < l; i++) {
				t = cookies[i].split('=');

				if (topic === decodeURIComponent(t[0])) {
					value = decodeURIComponent(t[1]);
					break;
				}
			}

			if (value) {
				try {
					value = JSON.parse(value);
				} catch (e) {}

				// 在内存中保留该值
				_get(CookieModel.prototype.__proto__ || Object.getPrototypeOf(CookieModel.prototype), 'setData', this).call(this, topic, value);
			} else {
				value = Promise.reject(null);
			}

			return value;
		}
		/**
   * @summary     当 setData 传入一个 json 时内部调用函数
   * @override
   * @protected
   * @param       {Object}    topic
   * @param       {Object}    [options]
   * @return      {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * @desc        因为设置 cookie 时有相关配置，故重写覆盖父类的 _setByObject 方法
   * */

	}, {
		key: '_setByObject',
		value: function _setByObject(topic, options) {
			var _this2 = this;

			return Promise.all(Object.keys(topic).map(function (d) {
				return _this2.setData(d, topic[d], options);
			})).then(function (data) {
				return !!data;
			});
		}

		// ---------- 公有方法 ----------
		/**
   * @summary     设置数据
   * @override
   * @param       {String|Object}             topic
   * @param       {*}                         value               当 topic 为 object 类型时，被视为 options
   * @param       {Object|Number|String}      [options]           相关配置
   * @param       {String}                    [options.path]
   * @param       {String}                    [options.domain]
   * @param       {Date|Number|String}        [options.expires]
   * @param       {String}                    [options.secure]
   * @return      {Promise}                   返回一个 Promise 对象，在 resolve 时传回 true
   * @desc        保存值得时候，同时会保持在内存中，当 topic 类型为 object 时，value 会视为 options
   * */

	}, {
		key: 'setData',
		value: function setData(topic, value, options) {
			var _this3 = this;

			var result = void 0;

			if ((typeof topic === 'undefined' ? 'undefined' : _typeof(topic)) === 'object') {
				options = value;

				result = this._setByObject(topic, options);
			} else {
				result = _get(CookieModel.prototype.__proto__ || Object.getPrototypeOf(CookieModel.prototype), 'setData', this).call(this, topic, value).then(function () {
					return _this3._store;
				}).then(function () {
					return _this3._setCookie(topic, value, options);
				});
			}

			return result;
		}
		/**
   * @summary 获取数据
   * @param   {String|String[]|...String} topic
   * @return  {Promise}                   返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
   * @desc    获取数据时会优先从内存中取值，若没有则从 cookie 中取值并将其存入内存中，当 topic 的类型为数组的时候，resolve 传入的结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值
   * */

	}, {
		key: 'getData',
		value: function getData(topic) {
			var _this4 = this;

			var argc = arguments.length,
			    result = void 0;

			if (Array.isArray(topic)) {
				result = this._getByArray(topic);
			} else if (argc > 1) {
				result = this._getByArray([].slice.call(arguments));
			} else {
				result = _get(CookieModel.prototype.__proto__ || Object.getPrototypeOf(CookieModel.prototype), 'getData', this).call(this, topic).catch(function () {
					// 内存中不存在该值
					return _this4._store.then(function () {
						return _this4._getCookie(topic);
					});
				});
			}

			return result;
		}
		/**
   * @summary 以同步的方式获取 cookie 中的数据
   * @param   {String|String[]|...String} topic
   * @return  {Object|String}             若存在 topic 的值，返回查询出来的 value，否则返回 null
   * @desc    获取数据时会优先从内存中取值，若没有则从 cookie 中取值并将其存入内存中，当 topic 的类型为数组的时候，返回结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值
   * */

	}, {
		key: 'getDataSync',
		value: function getDataSync(topic) {
			var _this5 = this;

			var argc = arguments.length,
			    keyList = void 0,
			    result = void 0;

			// 判断当前环境是否支持 cookie
			if (this._enabled) {

				if (!Array.isArray(topic)) {
					keyList = [topic];
				} else if (argc > 1) {
					keyList = [].slice.call(arguments);
				} else {
					keyList = topic;
				}

				result = keyList.reduce(function (all, d) {

					if (d in _this5._value) {
						all[d] = _this5._value[d];
					} else {
						all[d] = _this5._getCookie(d) || null;

						// 尝试解析
						try {
							all[d] = JSON.parse(all[d]);
						} catch (e) {}

						_get(CookieModel.prototype.__proto__ || Object.getPrototypeOf(CookieModel.prototype), 'setData', _this5).call(_this5, d, all[d]);
					}

					return all;
				}, {});

				if (!Array.isArray(topic)) {
					result = result[topic];
				}
			} else {
				result = null;
			}

			return result;
		}
		/**
   * @summary 将数据从缓存中删除
   * @param   {String|String[]}   topic
   * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回 true
   * @desc    调用 _setCookie 方法，过期时间为负值
   * */

	}, {
		key: 'removeData',
		value: function removeData(topic) {
			var _this6 = this;

			var result = void 0;
			if (Array.isArray(topic)) {
				result = this._removeByArray(topic);
			} else {
				result = _get(CookieModel.prototype.__proto__ || Object.getPrototypeOf(CookieModel.prototype), 'removeData', this).call(this, topic).then(function () {
					return _this6._setCookie(topic, '', -1);
				});
			}
			return result;
		}
		/**
   * @summary 清空数据
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * @desc    只调用了父类的 clearData 方法，清楚了内存中的数据，对 cookie 实际没做任何处理
   * */

	}, {
		key: 'clearData',
		value: function clearData() {
			return _get(CookieModel.prototype.__proto__ || Object.getPrototypeOf(CookieModel.prototype), 'clearData', this).call(this);
		}
		/**
   * @summary 获取 cookie 长度
   * @return  {Number}
   * */

	}, {
		key: 'getCookieLength',
		value: function getCookieLength() {
			return this._enabled ? document.cookie.length : 0;
		}
	}], [{
		key: '_transDate',
		value: function _transDate(date) {
			if (date instanceof Date) {} else {
				date = _dateFormat2.default.formatTimeStr(date);

				date = date === 0 ? '' : new Date(Date.now() + date);
			}
			// else if( typeof date === 'number' ){
			// 	temp = new Date();
			// 	temp.setTime( +temp + CookieModel._SHORT_TIME_NUM.d * date );
			// 	date = temp;
			// }
			// else if( temp = CookieModel._SHORT_TIME_EXPR.exec( date ) ){
			// 	date = new Date();
			// 	date.setTime( date.getTime() + Number( temp[1] ) * CookieModel._SHORT_TIME_NUM[temp[2]] );
			// }
			// else{
			// 	date = '';
			// }

			return date && date.toUTCString();
		}
	}]);

	return CookieModel;
}(_model2.default);

/**
 * 默认 cookie 设置参数
 * @const
 * @static
 * */


CookieModel._DEFAULT = {
	path: '/',
	domain: '',
	expires: '',
	secure: ''
};
// /**
//  * 简短时间设置格式
//  * @const
//  * @static
//  * */
// CookieModel._SHORT_TIME_EXPR = /^(-?\d+)(s|m|h|d|y)?$/i;
// /**
//  * 时间单位对应的毫秒数
//  * @const
//  * @static
//  * */
// CookieModel._SHORT_TIME_NUM = {
// 	s: 1e3
// 	, m: 6e4
// 	, h: 36e5
// 	, d: 864e5
// 	, y: 31536e6
// };

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
_model2.default.register('cookie', CookieModel);
/**
 * 注册别名
 * */
_model2.default.registerAlias('cookie', 'c');

exports.default = CookieModel;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _model = __webpack_require__(2);

var _model2 = _interopRequireDefault(_model);

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

var _listener = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 * @classdesc   对 localStorage 进行封装，统一调用接口，在 Model.factory 工厂方法注册为 localStorage，别名 ls，将可以使用工厂方法生成
 * @extends     Model
 * @example
 *
<pre>
let localStorageModel = new LocalStorageModel()
	, storage = Model.factory('localStorage')
	, ls = Model.factory('ls')
	;

storage.getData('fittingShow/index/first').then((value)=>{
	console.log('获取到 ', value);
});
</pre>
 * */
var LocalStorageModel = function (_Model) {
	_inherits(LocalStorageModel, _Model);

	/**
  * @constructor
  * @param   {Object}    [config={}]
  * @param   {Boolean}   [config.listen] 是否开启监听事件
  * */
	function LocalStorageModel() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, LocalStorageModel);

		var _this = _possibleConstructorReturn(this, (LocalStorageModel.__proto__ || Object.getPrototypeOf(LocalStorageModel)).call(this, config));

		_this._config = (0, _merge2.default)(config, LocalStorageModel._CONFIG);

		if ('localStorage' in self) {
			_this._enabled = true;
			_this._storeSync = self.localStorage;
			_this._store = Promise.resolve(self.localStorage);

			config.listen && !LocalStorageModel._listenOn && LocalStorageModel.listenOn();
		} else {
			_this._enabled = false;
			_this._storeSync = null;
			_this._store = Promise.reject(new Error('此浏览器不支持 localStorage'));
		}
		return _this;
	}

	// ---------- 静态方法 ----------
	/**
  * @summary 全局 storage 事件监听
  * @static
  * @desc    只执行一次，执行后将 LocalStorageModel._listenOn 设为 true，该监听事件只能由其他页面修改 localStorage 的数据时触发
  * */


	_createClass(LocalStorageModel, [{
		key: 'setData',


		// ---------- 公有方法 ----------
		/**
   * @summary 设置数据
   * @param   {String|Object} topic
   * @param   {*}             value   当 topic 为 object 类型时被忽略
   * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回 true
   * @desc    保持值得时候，同时会保持在内存中
   * */
		value: function setData(topic, value) {
			var _this2 = this;

			var result = void 0;

			if ((typeof topic === 'undefined' ? 'undefined' : _typeof(topic)) === 'object') {
				result = this._setByObject(topic);
			} else {
				result = _get(LocalStorageModel.prototype.__proto__ || Object.getPrototypeOf(LocalStorageModel.prototype), 'setData', this).call(this, topic, value).then(function () {
					return _this2._store.then(function (store) {
						store.setItem(topic, _this2._stringify(value));

						return true;
					});
				});
			}

			return result;
		}
		/**
   * @summary 获取数据
   * @param   {String|String[]|...String} topic
   * @return  {Promise}                   返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
   * @desc    获取数据时会优先从内存中取值，若没有则从 localStorage 中取值并将其存入内存中，当 topic 的类型为数组的时候，resolve 传入的结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值
   * */

	}, {
		key: 'getData',
		value: function getData(topic) {
			var _this3 = this;

			var argc = arguments.length,
			    result = void 0;

			if (Array.isArray(topic)) {
				result = this._getByArray(topic);
			} else if (argc.length > 1) {
				result = this._getByArray([].slice.call(arguments));
			} else {
				result = _get(LocalStorageModel.prototype.__proto__ || Object.getPrototypeOf(LocalStorageModel.prototype), 'getData', this).call(this, topic).catch(function () {
					return _this3._store.then(function (store) {
						var value = store.getItem(topic);

						if (value === null) {
							value = Promise.reject(null);
						} else {
							try {
								value = JSON.parse(value);
							} catch (e) {}

							// 在内存中保留该值
							_get(LocalStorageModel.prototype.__proto__ || Object.getPrototypeOf(LocalStorageModel.prototype), 'setData', _this3).call(_this3, topic, value);
						}

						return value;
					});
				});
			}

			return result;
		}
		/**
   * @summary 以同步的方式获取 localStorage 中的数据
   * @param   {String|String[]|...String}   topic
   * @return  {Object|String}     若存在 topic 的值，返回查询出来的 value，否则返回 null
   * @desc    获取数据时会优先从内存中取值，若没有则从 localStorage 中取值并将其存入内存中，当 topic 的类型为数组的时候，返回结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值
   * */

	}, {
		key: 'getDataSync',
		value: function getDataSync(topic) {
			var _this4 = this;

			var argc = arguments.length,
			    keyList = void 0,
			    result = void 0;

			if (this._enabled) {

				if (!Array.isArray(topic)) {
					keyList = [topic];
				} else if (argc > 1) {
					keyList = [].slice.call(arguments);
				} else {
					keyList = topic;
				}

				result = keyList.reduce(function (all, d) {
					if (d in _this4._value) {
						all[d] = _this4._value[d];
					} else {
						all[d] = _this4._storeSync.getItem(d);

						try {
							all[d] = JSON.parse(all[d]);
						} catch (e) {}

						_get(LocalStorageModel.prototype.__proto__ || Object.getPrototypeOf(LocalStorageModel.prototype), 'setData', _this4).call(_this4, d, all[d]);
					}
				}, {});

				if (!Array.isArray(topic)) {
					result = result[topic];
				}
			} else {
				result = null;
			}

			return result;
		}
		/**
   * @summary 将数据从缓存中删除
   * @param   {String|String[]}   topic
   * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: 'removeData',
		value: function removeData(topic) {
			var _this5 = this;

			var result = void 0;

			if (Array.isArray(topic)) {
				result = this._removeByArray(topic);
			} else {
				result = _get(LocalStorageModel.prototype.__proto__ || Object.getPrototypeOf(LocalStorageModel.prototype), 'removeData', this).call(this, topic).then(function () {
					return _this5._store.then(function (store) {
						store.removeItem(topic);

						return true;
					});
				});
			}

			return result;
		}
		/**
   * @summary 清空数据
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: 'clearData',
		value: function clearData() {
			var _this6 = this;

			return _get(LocalStorageModel.prototype.__proto__ || Object.getPrototypeOf(LocalStorageModel.prototype), 'clearData', this).call(this).then(function () {
				return _this6._store.then(function (store) {
					store.clear();

					return true;
				});
			});
		}

		/**
   * @summary 绑定数据监视事件
   * @param   {ModelChangeEvent}  callback
   * */

	}, {
		key: 'on',
		value: function on(callback) {

			this._eventList.push(callback);

			LocalStorageModel._EVENT_LIST.push(callback);
		}
		/**
   * @summary 解除绑定数据监控回调函数
   * @param   {ModelChangeEvent}  callback
   * */

	}, {
		key: 'off',
		value: function off(callback) {
			var i = this._eventList.indexOf(callback);

			if (i !== -1) {
				this._eventList.splice(i, 1);
			}

			i = LocalStorageModel._EVENT_LIST.indexOf(callback);
			if (i !== -1) {
				LocalStorageModel._EVENT_LIST.splice(i, 1);
			}
		}
	}], [{
		key: 'listenOn',
		value: function listenOn() {

			if (LocalStorageModel._listenOn) {
				return;
			}

			LocalStorageModel._globalStorage = (0, _listener.listener)('storage', function (e) {
				var topic = e.key,
				    newVal = e.newValue,
				    oldVal = e.oldValue;

				if (LocalStorageModel._EVENT_LIST.length) {

					LocalStorageModel._EVENT_LIST.forEach(function (d) {
						return d(topic, newVal, oldVal);
					});
				}
			});
			LocalStorageModel._listenOn = true;
		}
	}, {
		key: 'listenOff',
		value: function listenOff() {
			if (LocalStorageModel._listenOn && LocalStorageModel._globalStorage) {
				LocalStorageModel._globalStorage.off();

				LocalStorageModel._listenOn = false;
			}
		}
	}]);

	return LocalStorageModel;
}(_model2.default);

/**
 * 默认参数
 * @const
 * @static
 * */


LocalStorageModel._CONFIG = {
	listen: true
};
/**
 * 保存的事件队列
 * @static
 * */
LocalStorageModel._EVENT_LIST = [];
/**
 * 全局 storage 监听事件是否开启
 * @static
 * */
LocalStorageModel._listenOn = false;

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
_model2.default.register('localStorage', LocalStorageModel);
/**
 * 注册别名
 * */
_model2.default.registerAlias('localStorage', 'ls');

exports.default = LocalStorageModel;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _model = __webpack_require__(2);

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 * @classdesc   对 sessionStorage 进行封装，统一调用接口，在 Model.factory 工厂方法注册为 sessionStorage，别名 ss，将可以使用工厂方法生成
 * @extends     Model
 * @example
<pre>
let sessionStorageModel = new SessionStorageModel()
	, storage = Model.factory('sessionStorage')
	, ss = Model.factory('ss')
	;
 </pre>
 * */
var SessionStorageModel = function (_Model) {
	_inherits(SessionStorageModel, _Model);

	/**
  * @constructor
  * */
	function SessionStorageModel() {
		_classCallCheck(this, SessionStorageModel);

		var _this = _possibleConstructorReturn(this, (SessionStorageModel.__proto__ || Object.getPrototypeOf(SessionStorageModel)).call(this));

		if ('sessionStorage' in self) {
			_this._enabled = true;
			_this._storeSync = self.sessionStorage;
			_this._store = Promise.resolve(self.sessionStorage);
		} else {
			_this._enabled = false;
			_this._storeSync = null;
			_this._store = Promise.reject(new Error('此浏览器不支持 sessionStorage'));
		}
		return _this;
	}

	// ---------- 公有方法 ----------
	/**
  * @summary 设置数据
  * @param   {String|Object} topic
  * @param   {*}             value
  * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回 true
  * @desc    保持值得时候，同时会保持在内存中
  * */


	_createClass(SessionStorageModel, [{
		key: 'setData',
		value: function setData(topic, value) {
			var _this2 = this;

			var result = void 0;

			if ((typeof topic === 'undefined' ? 'undefined' : _typeof(topic)) === 'object') {
				result = this._setByObject(topic);
			} else {
				result = _get(SessionStorageModel.prototype.__proto__ || Object.getPrototypeOf(SessionStorageModel.prototype), 'setData', this).call(this, topic, value).then(function () {
					return _this2._store.then(function (store) {
						store.setItem(topic, _this2._stringify(value));

						return true;
					});
				});
			}

			return result;
		}
		/**
   * @summary 获取数据
   * @param   {String|String[]|...String} topic
   * @return  {Promise}                   返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
   * @desc    获取数据时会优先从内存中取值，若没有则从 sessionStorage 中取值并将其存入内存中，当 topic 的类型为数组的时候，resolve 传入的结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值
   * */

	}, {
		key: 'getData',
		value: function getData(topic) {
			var _this3 = this;

			var argc = arguments.length,
			    result = void 0;

			if (Array.isArray(topic)) {
				result = this._getByArray(topic);
			} else if (argc > 1) {
				result = this._getByArray([].slice.call(arguments));
			} else {
				result = _get(SessionStorageModel.prototype.__proto__ || Object.getPrototypeOf(SessionStorageModel.prototype), 'getData', this).call(this, topic).catch(function () {
					return _this3._store.then(function (store) {
						var value = store.getItem(topic);

						if (value === null) {
							value = Promise.reject(null);
						} else {
							try {
								value = JSON.parse(value);
							} catch (e) {}

							// 在内存中保留该值
							_get(SessionStorageModel.prototype.__proto__ || Object.getPrototypeOf(SessionStorageModel.prototype), 'setData', _this3).call(_this3, topic, value);
						}

						return value;
					});
				});
			}

			return result;
		}
		/**
   * @summary 以同步的方式获取 sessionStorage 中的数据
   * @param   {String|String[]|...String} topic
   * @return  {Object|String}             若存在 topic 的值，返回查询出来的 value，否则返回 null
   * @desc    获取数据时会优先从内存中取值，若没有则从 sessionStorage 中取值并将其存入内存中，当 topic 的类型为数组的时候，返回结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值
   * */

	}, {
		key: 'getDataSync',
		value: function getDataSync(topic) {
			var _this4 = this;

			var argc = arguments.length,
			    keyList = void 0,
			    result = void 0;

			if (this._enabled) {

				if (!Array.isArray(topic)) {
					keyList = [topic];
				} else if (argc > 1) {
					keyList = [].slice.call(arguments);
				} else {
					keyList = topic;
				}

				result = keyList.reduce(function (all, d) {
					if (d in _this4._value) {
						all[d] = _this4._value[d];
					} else {
						all[d] = _this4._storeSync.getItem(d);

						try {
							all[d] = JSON.parse(all[d]);
						} catch (e) {}

						_get(SessionStorageModel.prototype.__proto__ || Object.getPrototypeOf(SessionStorageModel.prototype), 'setData', _this4).call(_this4, d, all[d]);
					}
				}, {});

				if (!Array.isArray(topic)) {
					result = result[topic];
				}
			} else {
				result = null;
			}

			return result;
		}
		/**
   * @summary 将数据从缓存中删除
   * @param   {String|String[]}   topic
   * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: 'removeData',
		value: function removeData(topic) {
			var _this5 = this;

			var result = void 0;

			if (result) {
				result = this._removeByArray(topic);
			} else {
				result = _get(SessionStorageModel.prototype.__proto__ || Object.getPrototypeOf(SessionStorageModel.prototype), 'removeData', this).call(this, topic).then(function () {
					return _this5._store.then(function (store) {
						store.removeItem(topic);

						return true;
					});
				});
			}

			return result;
		}
		/**
   * @summary 清空数据
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: 'clearData',
		value: function clearData() {
			var _this6 = this;

			return _get(SessionStorageModel.prototype.__proto__ || Object.getPrototypeOf(SessionStorageModel.prototype), 'clearData', this).call(this).then(function () {
				return _this6._store.then(function (store) {
					store.clear();

					return true;
				});
			});
		}
	}]);

	return SessionStorageModel;
}(_model2.default);

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */


_model2.default.register('sessionStorage', SessionStorageModel);

/**
 * 注册别名
 * */
_model2.default.registerAlias('sessionStorage', 'ss');

exports.default = SessionStorageModel;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _model = __webpack_require__(2);

var _model2 = _interopRequireDefault(_model);

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 * @classdesc   对 IndexedDB 进行封装，统一调用接口，在 Model.factory 工厂方法注册为 indexedDB，别名 idb，将可以使用工厂方法生成
 * @extends     Model
 * @example
<pre>
let indexedDBModel = new IndexedDBModel()
	, storage = Model.factory('indexedDB')
	, idb = Model.factory('idb')
	;
</pre>
 * */
var IndexedDBModel = function (_Model) {
	_inherits(IndexedDBModel, _Model);

	/**
  * @constructor
  * @param   {Object}    [config={}]
  * @param   {String}    [config.dbName]
  * @param   {String}    [config.tableName]
  * @param   {Number}    [config.dbVersion]
  * @param   {String}    [config.keyPath]
  * @param   {Object[]}  [config.index]
  * @param   {String}    config.index[].name
  * @param   {String}    [config.index[].keyPath]    未设置时默认使用 name
  * @param   {Boolean}   [config.index[].unique=false]   默认值 false
  * */
	function IndexedDBModel() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, IndexedDBModel);

		var _this = _possibleConstructorReturn(this, (IndexedDBModel.__proto__ || Object.getPrototypeOf(IndexedDBModel)).call(this));

		_this._config = (0, _merge2.default)(config, IndexedDBModel._CONFIG);

		// this._store 为 Promise 类型，会在 resolve 中传入 db 实例，因为要保证数据库打开成功才可以操作
		_this._store = new Promise(function (resolve, reject) {
			var indexedDB = void 0,
			    dbOpenRequest = void 0;

			indexedDB = self.indexedDB || self.mozIndexedDB || self.webbkitIndexedDB || self.msIndexedDB || null;

			if (indexedDB) {
				dbOpenRequest = indexedDB.open(_this._config.dbName, _this._config.dbVersion);

				/**
     * DB 版本设置或升级时回调
     * createObjectStore deleteObjectStore 只能在 onupgradeneeded 事件中使用
     * */
				dbOpenRequest.onupgradeneeded = function (e) {
					var db = e.target.result,
					    store = void 0;

					// 创建表
					if (!db.objectStoreNames.contains(_this._config.tableName)) {

						// 创建存储对象
						store = db.createObjectStore(_this._config.tableName, {
							keyPath: _this._config.keyPath
						});

						_this._config.index.forEach(function (d) {
							store.createIndex(d.name, d.keyPath || d.name, {
								unique: d.unique || false
							});
						});
					}
				};
				dbOpenRequest.onsuccess = function (e) {
					resolve(e.target.result);
				};
				dbOpenRequest.onerror = function (e) {
					console.log(e);
					reject(e);
				};
			} else {
				reject(new Error('此数据库不支持 IndexedDB'));
			}
		});
		return _this;
	}

	// ---------- 私有方法 ----------
	/**
  * @summary 查询
  * @private
  * @param   {String}    topic
  * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回查询出来的 value
  * */


	_createClass(IndexedDBModel, [{
		key: '_select',
		value: function _select(topic) {
			var _this2 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					var objectStore = db.transaction([_this2._config.tableName], 'readwrite').objectStore(_this2._config.tableName),
					    objectStoreRequest = objectStore.get(topic);

					objectStoreRequest.onsuccess = function (e) {
						resolve(e.target.result);
					};
					objectStoreRequest.onerror = function (e) {
						console.log(e);
						reject(e);
					};
				});
			});
		}
		/**
   * @summary 新建或更新
   * @private
   * @param   {String}    topic
   * @param   {String}    value
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * @desc    add 接口要求数据库中不能已经有相同键的对象存在，因此统一使用 put 接口
   * */

	}, {
		key: '_put',
		value: function _put(topic, value) {
			var _this3 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					var objectStore = db.transaction([_this3._config.tableName], 'readwrite').objectStore(_this3._config.tableName),
					    objectStoreRequest = objectStore.put({
						topic: topic,
						value: value
					});

					objectStoreRequest.onsuccess = function (e) {
						resolve(!!e.target.result);
					};
					objectStoreRequest.onerror = function (e) {
						console.log(e);
						reject(e);
					};
				});
			});
		}
		/**
   * @summary 删除
   * @private
   * @param   {String}    topic
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: '_delete',
		value: function _delete(topic) {
			var _this4 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					var objectStore = db.transaction([_this4._config.tableName], 'readwrite').objectStore(_this4._config.tableName),
					    objectStoreRequest = objectStore.delete(topic);

					objectStoreRequest.onsuccess = function (e) {
						resolve(true);
					};
					objectStoreRequest.onerror = function (e) {
						console.log(e);
						reject(e);
					};
				});
			});
		}
		/**
   * @summary 清空
   * @private
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: '_clear',
		value: function _clear() {
			var _this5 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					var objectStore = db.transaction([_this5._config.tableName], 'readwrite').objectStore(_this5._config.tableName),
					    objectStoreRequest = objectStore.clear();

					objectStoreRequest.onsuccess = function (e) {
						resolve(true);
					};
					objectStoreRequest.onerror = function (e) {
						console.log(e);
						reject(e);
					};
				});
			});
		}

		// ---------- 公有方法 ----------
		/**
   * @summary 设置数据
   * @param   {String|Object} topic
   * @param   {*}             value
   * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回 true
   * @desc    保持值得时候，同时会保持在内存中
   * */

	}, {
		key: 'setData',
		value: function setData(topic, value) {
			var _this6 = this;

			var result = void 0;

			if ((typeof topic === 'undefined' ? 'undefined' : _typeof(topic)) === 'object') {
				result = this._setByObject(topic);
			} else {
				result = _get(IndexedDBModel.prototype.__proto__ || Object.getPrototypeOf(IndexedDBModel.prototype), 'setData', this).call(this, topic, value).then(function () {
					return _this6._put(topic, value);
				});
			}

			return result;
		}
		/**
   * @summary 获取数据
   * @param   {String|String[]|...String} topic
   * @return  {Promise}                   返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
   * @desc    获取数据时会优先从内存中取值，若没有则从 indexedDB 中取值并将其存入内存中，当 topic 的类型为数组的时候，resolve 传入的结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值
   * */

	}, {
		key: 'getData',
		value: function getData(topic) {
			var _this7 = this;

			var argc = arguments.length,
			    result = void 0;

			if (Array.isArray(topic)) {
				result = this._getByArray(topic);
			} else if (argc > 1) {
				result = this._getByArray([].slice.call(arguments));
			} else {
				result = _get(IndexedDBModel.prototype.__proto__ || Object.getPrototypeOf(IndexedDBModel.prototype), 'getData', this).call(this, topic).catch(function () {
					return _this7._select(topic).then(function (rs) {
						var value = void 0;

						if (rs) {
							value = rs.value;

							if (typeof value === 'string') {
								// 若为字符串类型的数据，尝试进行解析
								try {
									value = JSON.parse(value);
								} catch (e) {}
							}

							// 在内存中保留该值
							_get(IndexedDBModel.prototype.__proto__ || Object.getPrototypeOf(IndexedDBModel.prototype), 'setData', _this7).call(_this7, topic, value);
						} else {
							value = Promise.reject(null);
						}

						return value;
					});
				});
			}

			return result;
		}
		/**
   * @summary 将数据从缓存中删除
   * @param   {String|String[]}   topic
   * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: 'removeData',
		value: function removeData(topic) {
			var _this8 = this;

			var result = void 0;

			if (Array.isArray(topic)) {
				result = this._removeByArray(topic);
			} else {
				result = _get(IndexedDBModel.prototype.__proto__ || Object.getPrototypeOf(IndexedDBModel.prototype), 'removeData', this).call(this, topic).then(function () {
					return _this8._delete(topic);
				});
			}

			return result;
		}
		/**
   * @summary 清空数据
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 true
   * */

	}, {
		key: 'clearData',
		value: function clearData() {
			var _this9 = this;

			return _get(IndexedDBModel.prototype.__proto__ || Object.getPrototypeOf(IndexedDBModel.prototype), 'clearData', this).call(this).then(function () {
				return _this9._clear();
			});
		}
		/**
   * @summary 获取通过 range 获取数据
   * @param   {Number}            [min]
   * @param   {Number|Boolean}    [max]
   * @param   {Boolean}           [eqMin=true]
   * @param   {Boolean}           [eqMax=true]
   * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回 cursor 列表
   * @todo    区间取值功能
   * */

	}, {
		key: 'getDataByRange',
		value: function getDataByRange(min, max) {
			var _this10 = this;

			var eqMin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
			var eqMax = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

			var argc = arguments.length;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					var objectStore = db.transaction([_this10._config.tableName], 'readwrite').objectStore(_this10._config.tableName)
					// , keyRangeValue = IDBKeyRange.bound(min, max, eqMin, eqMax)
					// , objectStoreRequest = objectStore.openCursor( keyRangeValue )
					,
					    objectStoreRequest = objectStore.openCursor(),
					    cursorList = [];

					// switch( argc ){
					// 	case 1:
					// 		keyRangeValue = IDBKeyRange.bound( min );
					// 		break;
					// 	case 2:
					// 		if( typeof max === 'boolean' ){
					// 			keyRangeValue = IDBKeyRange.lowerBound(min, max);
					// 		}
					// 		else{
					// 			keyRangeValue = IDBKeyRange.bound(min, max);
					// 		}
					// 		break;
					// 	case 3:
					// 		keyRangeValue = IDBKeyRange.bound()
					// 		break;
					// 	case 4:
					// 		break;
					// 	default:
					// 		break;
					// }

					objectStoreRequest.onsuccess = function (e) {
						var cursor = e.target.result;

						if (cursor) {
							cursorList.push(cursor.value);

							cursor.continue();
						} else {
							resolve(cursorList);
						}
					};
					objectStoreRequest.onerror = function (e) {
						console.log(e);
						reject(e);
					};
				});
			});
		}
	}]);

	return IndexedDBModel;
}(_model2.default);

/**
 * 默认配置
 * @const
 * @static
 * */


IndexedDBModel._CONFIG = {
	dbName: 'storage',
	tableName: 'storage',
	dbVersion: 1,
	keyPath: 'topic',
	index: [{
		name: 'topic',
		keyPath: 'topic',
		unique: true
	}, {
		name: 'value',
		keyPath: 'value',
		unique: false
	}]
};

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
_model2.default.register('indexedDB', IndexedDBModel);
/**
 * 注册别名
 * */
_model2.default.registerAlias('indexedDB', 'idb');

exports.default = IndexedDBModel;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _model = __webpack_require__(2);

var _model2 = _interopRequireDefault(_model);

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 * @classdesc   对 WebSQL Database 进行封装，统一调用接口，在 Model.factory 工厂方法注册为 webSQL，别名 ws,sql，将可以使用工厂方法生成。默认使用表名为 storage，有 id,topic,value 3 个列的表，在生成对象时传入 options 可覆盖默认 SQL 语句
 * @extends     Model
 * @example
<pre>
let webSQLModel = new WebSQLModel()
	, storage = Model.factory('webSQL')
	, ws = Model.factory('ws')
	, sql = Model.factory('sql')
    , newSQL = Model.factory('webSQL', {
        tableName: 'newStorage'
    })
	;

newSQL.setData('index/data', {});   // newSQL 不会被缓存
</pre>
 * */
var WebSQLModel = function (_Model) {
	_inherits(WebSQLModel, _Model);

	/**
  * @constructor
  * @param   {Object}    [config={}]
  * @param   {String}    [config.dbName]
  * @param   {String}    [config.tableName]
  * @param   {Number}    [config.dbVersion]
  * @param   {Number}    [config.dbSize] 单位字节
  * @param   {Object}    [config.sql]
  * @param   {String}    [config.sql.create] 创建表时执行的 sql 语句
  * @param   {String}    [config.sql.select] 查询时执行的 sql 语句
  * @param   {String}    [config.sql.update] 更新时执行的 sql 语句
  * @param   {String}    [config.sql.insert] 插入时执行的 sql 语句
  * @param   {String}    [config.sql.delete] 删除时执行的 sql 语句
  * @param   {String}    [config.sql.clear]  clearData 时执行的 sql 语句
  * @desc    传入 sql 语句时，可用 {{tableName}} 来代替表名
  * */
	function WebSQLModel() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, WebSQLModel);

		var _this = _possibleConstructorReturn(this, (WebSQLModel.__proto__ || Object.getPrototypeOf(WebSQLModel)).call(this));

		var sql = config.sql;

		_this._config = (0, _merge2.default)(config, WebSQLModel._CONFIG);

		if (sql && (typeof sql === 'undefined' ? 'undefined' : _typeof(sql)) === 'object') {

			_this._config.sql = (0, _merge2.default)(sql, WebSQLModel._CONFIG.sql);
		}

		Object.keys(_this._config.sql).forEach(function (d) {
			_this._config.sql[d] = _this._replaceTableName(_this._config.sql[d]);
		});

		// this._store 为 Promise 类型，会在 resolve 中传入 db 实例，因为要保证数据表存在才可以操作
		_this._store = new Promise(function (resolve, reject) {
			var db = void 0;

			if ('openDatabase' in self) {
				// 打开数据库，若不存在则创建
				db = openDatabase(_this._config.dbName, '' + _this._config.dbVersion, _this._config.dbName, _this._config.dbSize);

				db.transaction(function (tx) {
					// 若没有数据表则创建
					tx.executeSql(_this._config.sql.create, [], function () {
						resolve(db);
					}, function (tx, e) {
						console.log(e);
						reject(e);
					});
				});
			} else {
				reject(new Error('此浏览器不支持 Web SQL Database'));
			}
		});
		return _this;
	}

	// ---------- 私有方法 ----------
	/**
  * @summary 替换表名
  * @private
  * @param   {String}    sql
  * @return  {String}    替换完成的 sql 语句
  * */


	_createClass(WebSQLModel, [{
		key: '_replaceTableName',
		value: function _replaceTableName(sql) {
			return sql.replace(/{{tableName}}/g, this._config.tableName);
		}
		/**
   * @summary 查询
   * @private
   * @param   {String}    topic
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回查询出来的数组
   * */

	}, {
		key: '_select',
		value: function _select(topic) {
			var _this2 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					db.transaction(function (tx) {
						tx.executeSql(_this2._config.sql.select, [topic], function (tx, rs) {
							resolve(rs.rows);
						}, function (tx, e) {
							console.log(e);
							reject(e);
						});
					});
				});
			});
		}
		/**
   * @summary 更新
   * @private
   * @param   {String}    topic
   * @param   {String}    value
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
   * */

	}, {
		key: '_update',
		value: function _update(topic, value) {
			var _this3 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					db.transaction(function (tx) {
						tx.executeSql(_this3._config.sql.update, [value, topic], function (tx, rs) {
							resolve(!!rs.rowsAffected);
						}, function (tx, e) {
							console.log(e);
							reject(e);
						});
					});
				});
			});
		}
		/**
   * @summary 新建
   * @private
   * @param   {String}    topic
   * @param   {String}    value
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回新插入行 id 的 boolean 值
   * */

	}, {
		key: '_insert',
		value: function _insert(topic, value) {
			var _this4 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					db.transaction(function (tx) {
						tx.executeSql(_this4._config.sql.insert, [topic, value], function (tx, rs) {
							resolve(!!rs.insertId);
						}, function (tx, e) {
							console.log(e);
							reject(e);
						});
					});
				});
			});
		}
		/**
   * @summary 删除
   * @private
   * @param   {String}    topic
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
   * */

	}, {
		key: '_delete',
		value: function _delete(topic) {
			var _this5 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					db.transaction(function (tx) {
						tx.executeSql(_this5._config.sql.delete, [topic], function (tx, rs) {
							resolve(!!rs.rowsAffected);
						}, function (tx, e) {
							console.log(e);
							reject(e);
						});
					});
				});
			});
		}
		/**
   * @summary 清空表
   * @private
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
   * */

	}, {
		key: '_clear',
		value: function _clear() {
			var _this6 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					db.transaction(function (tx) {
						tx.executeSql(_this6._config.sql.clear, [], function (tx, rs) {
							resolve(!!rs.rowsAffected);
						}, function (tx, e) {
							console.log(e);
							reject(e);
						});
					});
				});
			});
		}

		// ---------- 公有方法 ----------
		/**
   * @summary 设置数据
   * @param   {String|Object} topic
   * @param   {*}             value
   * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
   * @desc    保持值得时候，同时会保持在内存中
   * */

	}, {
		key: 'setData',
		value: function setData(topic, value) {
			var _this7 = this;

			var result = void 0;

			if ((typeof topic === 'undefined' ? 'undefined' : _typeof(topic)) === 'object') {
				result = this._setByObject(topic);
			} else {
				result = _get(WebSQLModel.prototype.__proto__ || Object.getPrototypeOf(WebSQLModel.prototype), 'setData', this).call(this, topic, value).then(function () {

					value = _this7._stringify(value);

					return _this7._select(topic);
				}).then(function (rs) {
					var result = void 0;

					if (rs && rs.length) {
						// topic 已存在
						result = _this7._update(topic, value);
					} else {
						result = _this7._insert(topic, value);
					}

					return result;
				});
			}

			return result;
		}
		/**
   * @summary 获取数据
   * @param   {String|String[]|...String} topic
   * @return  {Promise}                   返回一个 Promise 对象，若存在 topic 的值，在 resolve 时传回查询出来的 value，否则在 reject 时传回 null
   * @desc    获取数据时会优先从内存中取值，若没有则从 WebSQL Database 中取值并将其存入内存中，当 topic 的类型为数组的时候，resolve 传入的结果为一个 json，key 为 topic 中的数据，value 为对应查找出来的值
   * */

	}, {
		key: 'getData',
		value: function getData(topic) {
			var _this8 = this;

			var argc = arguments.length,
			    result = void 0;

			if (Array.isArray(topic)) {
				result = this._getByArray(topic);
			} else if (argc > 1) {
				result = this._getByArray([].slice.call(arguments));
			} else {
				result = _get(WebSQLModel.prototype.__proto__ || Object.getPrototypeOf(WebSQLModel.prototype), 'getData', this).call(this, topic).catch(function () {
					return _this8._select(topic).then(function (rs) {
						var value = '';

						if (rs && rs.length) {
							// 只返回第一条数据
							value = rs[0].value;

							try {
								value = JSON.parse(value);
							} catch (e) {}

							// 在内存中保留该值
							_get(WebSQLModel.prototype.__proto__ || Object.getPrototypeOf(WebSQLModel.prototype), 'setData', _this8).call(_this8, topic, value);
						} else {
							value = Promise.reject(null);
						}

						return value;
					});
				});
			}

			return result;
		}
		/**
   * @summary 将数据从缓存中删除
   * @param   {String|String[]}   topic
   * @return  {Promise}           返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
   * */

	}, {
		key: 'removeData',
		value: function removeData(topic) {
			var _this9 = this;

			var result = void 0;

			if (Array.isArray(topic)) {
				result = this._removeByArray(topic);
			} else {
				result = _get(WebSQLModel.prototype.__proto__ || Object.getPrototypeOf(WebSQLModel.prototype), 'removeData', this).call(this, topic).then(function () {
					return _this9._delete(topic);
				});
			}

			return result;
		}
		/**
   * @summary 清空数据
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回影响行数的 boolean 值
   * */

	}, {
		key: 'clearData',
		value: function clearData() {
			var _this10 = this;

			return this.clearData().then(function () {
				return _this10._clear();
			});
		}

		/**
   * @summary 独立执行 sql 方法
   * @param   {String}    sql
   * @param   {Array}     [value=[]]
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 sql 语句的执行结果
   * */

	}, {
		key: 'executeSql',
		value: function executeSql(sql) {
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					db.transaction(function (tx) {
						tx.executeSql(sql, value, function (tx, rs) {
							resolve(rs);
						}, function (tx, e) {
							console.log(e);
							reject(e);
						});
					});
				});
			});
		}
		/**
   * @summary 针对某列建立索引
   * @param   {String}    col
   * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回 sql 语句的执行结果
   * */

	}, {
		key: 'createIndex',
		value: function createIndex(col) {
			var _this11 = this;

			return this._store.then(function (db) {
				return new Promise(function (resolve, reject) {
					db.transaction(function (tx) {
						tx.executeSql(_this11._config.sql.createIndex.replace(/{{col}}/g, col), [], function (tx, rs) {
							resolve(!!rs.rowsAffected);
						}, function (tx, e) {
							reject(e);
						});
					});
				});
			});
		}
	}]);

	return WebSQLModel;
}(_model2.default);

/**
 * 默认配置
 * @const
 * @static
 * */


WebSQLModel._CONFIG = {
	dbName: 'storage',
	tableName: 'storage',
	dbVersion: 1
	// 数据库可用空间大小，如果指定太大，浏览器会提示用户是否允许使用这么多空间
	, dbSize: 2 << 20,
	sql: {
		create: 'create table if not exists `{{tableName}}`(id integer primary key autoincrement,topic text unique,value text)',
		select: 'select * from `{{tableName}}` where topic=?',
		update: 'update `{{tableName}}` set value=? where topic=?',
		insert: 'insert into `{{tableName}}`(topic,value) values(?,?)',
		delete: 'delete from `{{tableName}}` where topic=?',
		clear: 'delete from `{{tableName}}`',
		createIndex: 'create index if not exists index_{{col}} on `{{tableName}}`(`{{col}}`)'
	}
};

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
_model2.default.register('webSQL', WebSQLModel);
/**
 * 注册别名
 * */
_model2.default.registerAlias('webSQL', ['ws', 'sql']);

exports.default = WebSQLModel;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import $            from 'jquery';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = __webpack_require__(2);

var _model2 = _interopRequireDefault(_model);

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

var _handlerQueue = __webpack_require__(28);

var _handlerQueue2 = _interopRequireDefault(_handlerQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @file    所有 ajax 请求基类
 *          目前数据请求依赖于 jQuery.ajax 方法
 * @todo    替换为自开发请求类库
 * */

/**
 * @class
 * @classdesc   对服务器接口进行封装，与 Model 统一接口，隔离数据与数据来源的问题，在 Model.factory 工厂方法注册为 service，别名 s，将可以使用工厂方法生成
 * @extends     Model
 *
 * @todo 支持 RESTful API
 * @todo 通道功能，一个 topic 一次只能发送一条，其余保存在队列中，等待当前发送的返回，再发送下一条
 * @todo 限制同时发送的请求的最大数量
 * */
var ServiceModel = function (_Model) {
	_inherits(ServiceModel, _Model);

	/**
  * @constructor
  * @param   {Object}    [config={}]
  * @param   {String}    [config.baseUrl]
  // * @param   {Boolean}   [config.isCrossDomain]
  // * @param   {Boolean}   [config.useLock]
  * @param   {Number}    [config.timeout]
  * */
	function ServiceModel() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, ServiceModel);

		var _this = _possibleConstructorReturn(this, (ServiceModel.__proto__ || Object.getPrototypeOf(ServiceModel)).call(this));

		_this._config = (0, _merge2.default)(config, ServiceModel._CONFIG);

		_this._syncTo = null;

		_this.interceptor = {
			req: new _handlerQueue2.default(),
			res: new _handlerQueue2.default()
		};
		return _this;
	}

	// ---------- 私有方法 ----------
	/**
  * @summary 对 setData 和 getData 的 options 添加默认参数
  * @param   {Object}    options setData 和 getData 的 options 参数
  * @return  {Object}
  * */


	_createClass(ServiceModel, [{
		key: '_setOpts',
		value: function _setOpts(options) {
			return (0, _merge2.default)(options, {
				cache: false,
				dataType: 'json',
				timeout: this._config.timeout || 10000,
				xhrFields: {
					withCredentials: true
				}
			});
		}

		// ---------- 公有方法 ----------
		/**
   * @summary     设置数据，默认视为发送 POST 请求到服务器，不会将返回结果保存到本地缓存
   * @override
   * @param       {String|Object} topic               字符串类型为请求 url，对象类型为所有参数，其中 url 为必填
   * @param       {String}        topic.url
   * @param       {Object}        [options={}]
   * @param       {Object}        [options.data]
   * @param       {String}        [options.method]
   * @return      {Promise}
   * */

	}, {
		key: 'setData',
		value: function setData(topic) {
			var _this2 = this;

			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var result = void 0;

			if ((typeof topic === 'undefined' ? 'undefined' : _typeof(topic)) === 'object') {
				options = topic;
				topic = options.url;
			}

			topic = this._config.baseUrl + topic;

			options = this._setOpts(options);

			options.method = options.method || 'POST';

			if (topic) {

				// 执行请求拦截器
				result = this.reqInterceptor(topic, options).then(function (rs) {

					// 发送请求，向服务器发送数据
					console.log('发送 post 请求', topic);

					return _this2.request(topic, options);
				}).then(function (res) {

					// 执行响应拦截器
					return _this2.resInterceptor(res);
				});
			} else {
				// topic 无值不做任何处理
				result = Promise.reject();
			}

			return result;
		}
		/**
   * @summary     获取数据，默认视为发送 GET 请求到服务器，可以将返回结果保存到本地缓存
   * @override
   * @param       {String|Object}     topic               字符串类型为请求 url，对象类型为所有参数，其中 url 为必填
   * @param       {Object|Boolean}    [options={}]        对象类型为 ajax 参数，Boolean 类型时将其赋值给 isCache，自身设置为 {}
   * @param       {Object}            [options.data]
   * @param       {String}            [options.method]
   * @param       {Boolean}           [isCache=false]     是否优先从本地缓存中读取数据，同时发送请求后数据是否同步到本地缓存，默认为 false
   * @return      {Promise}
   * @todo    优先从本地 syncTo model 中读取数据，若没有则发送请求
   * */

	}, {
		key: 'getData',
		value: function getData(topic) {
			var _this3 = this;

			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var isCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var result = void 0;

			if (typeof options === 'boolean') {
				isCache = options;
				options = {};
			}

			if ((typeof topic === 'undefined' ? 'undefined' : _typeof(topic)) === 'object') {
				options = topic;
				topic = options.url;
			}

			if (topic) {
				// 判断是否设置了本地缓存以及是否从本地缓存中读取数据
				if (isCache && this._syncTo) {
					// todo 解决多个本地缓存优先级的问题
					result = this._syncTo.getData(topic);
				} else {
					result = Promise.reject();

					topic = this._config.baseUrl + topic;

					options = this._setOpts(options);

					options.method = options.method || 'GET';
				}

				// 当从本地缓存时未找到期望的数据会 reject，或者不从缓存中获取数据时也会 reject
				result = result.catch(function () {

					// 执行请求拦截器
					return _this3.reqInterceptor(topic, options).then(function () {

						// 发送请求，从服务器获取数据
						console.log('发送 get 请求', topic);

						return _this3.request(topic, options);
					}).then(function (res) {

						// 执行响应拦截器
						return _this3.resInterceptor(res);
					}).then(function (data) {
						// 将数据同步
						var result = void 0;

						if (isCache && _this3._syncTo) {
							// 如果有设置缓存，则将请求返回的数据存入本地缓存
							result = _this3._syncTo.setData(topic, data).then(function () {
								return data;
							}, function (e) {
								console.log(e);

								return data;
							});
						} else {
							result = data;
						}

						return result;
					});
				});
			} else {
				// topic 无值不做任何处理
				result = Promise.reject();
			}

			return result;
		}
		/**
   * @summary     删除数据
   * @override
   * @param       {String|Object} topic
   * @param       {Object}        [options]
   * @return      {Promise}
   * @todo        可以考虑支持 RESTful API，发送 delete 类型的请求
   * */

	}, {
		key: 'removeData',
		value: function removeData(topic, options) {

			return Promise.resolve(true);
		}
		/**
   * @summary 清空数据，实际不做任何处理
   * */

	}, {
		key: 'clearData',
		value: function clearData() {
			return Promise.resolve(true);
		}
		/**
   * @summary     将数据同步到本地存储，一次只能设置一个本地缓存
   * @override
   * @param       {Model}     model
   * @todo        目前只能将数据同步到一个本地缓存中，是否考虑可以同步到多个本地缓存，亦或由本地缓存之间设置同步
   * */

	}, {
		key: 'syncTo',
		value: function syncTo(model) {

			// 判断 model 是继承自 Model 的类但并不继承自 ServiceModel
			if (model instanceof _model2.default && !(model instanceof ServiceModel)) {
				this._syncTo = model;
			}
		}
		/**
   * @summary 发送请求
   * @param   {String}    topic
   * @param   {Object}    options
   * @return  {Promise}
   * */

	}, {
		key: 'request',
		value: function request(topic, options) {

			try {
				return $.ajax(topic, options).then(function (res) {
					// 请求成功
					return res;
				}, function () {
					// 请求失败
					return new Error();
				});
			} catch (e) {
				console.log('未加载 jquery');
				return Promise.reject();
			}
		}
		/**
   * @summary 执行请求拦截器进行验证
   * @param   {String}    topic
   * @param   {Object}    options
   * @return  {Promise}
   * */

	}, {
		key: 'reqInterceptor',
		value: function reqInterceptor(topic, options) {
			var _this4 = this;

			var condition = function condition(rs) {
				var result = rs.some(function (d) {
					return d === false;
				});

				if (result) {
					return Promise.reject();
				} else {
					return Promise.resolve();
				}
			};

			console.log('执行全局请求拦截器', topic);
			return Promise.all(ServiceModel.interceptor.req.fireAll(null, topic, options)).then(condition).then(function () {
				console.log('执行局部请求拦截器', topic);

				return Promise.all(_this4.interceptor.req.fireAll(null, topic, options)).then(condition);
			});
		}
		/**
   * @summary 执行响应拦截器进行验证
   * @param   {Object}    res
   * @return  {Promise}
   * */

	}, {
		key: 'resInterceptor',
		value: function resInterceptor(res) {
			var _this5 = this;

			console.log('执行全局响应拦截器');

			return ServiceModel.interceptor.res.fireReduce(res).then(function (res) {
				console.log('执行局部响应拦截器');

				return _this5.interceptor.res.fireReduce(res);
			});
		}
	}]);

	return ServiceModel;
}(_model2.default);

/**
 * 默认配置
 * @static
 * */


ServiceModel._CONFIG = {
	baseUrl: ''
	// , isCrossDomain: true
	, task: false
	// , jsonp: false
	, timeout: 10000
};

/**
 * 拦截器
 * @static
 * */
ServiceModel.interceptor = {
	req: new _handlerQueue2.default(),
	res: new _handlerQueue2.default()
};

/**
 * 特别标记 ServiceModel
 * */
_model2.default.ServiceModel = ServiceModel;

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
_model2.default.register('service', ServiceModel);
/**
 * 注册别名
 * */
_model2.default.registerAlias('service', 's');

exports.default = ServiceModel;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HandlerQueue = function () {
	/**
  * @constructor
  * */
	function HandlerQueue() {
		_classCallCheck(this, HandlerQueue);

		this._queue = [];
		this._currIndex = 0;
	}

	// ---------- 公有函数 ----------
	/**
  * @summary 向队列中添加 handler
  * @param   {Function}  handler
  * @return  {Number}    handler 在队列中的 id，方便删除
  * */


	_createClass(HandlerQueue, [{
		key: 'add',
		value: function add(handler) {
			if (typeof handler === 'function') {
				return this._queue.push(handler);
			} else {
				return -1;
			}
		}
		/**
   * @summary 从队列中移除相应的 handler
   * @param   {Number|Function}   findBy
   * */

	}, {
		key: 'remove',
		value: function remove(findBy) {

			if (typeof findBy === 'function') {
				findBy = this._queue.indexOf(findBy);
			} else if (typeof findBy === 'number') {
				findBy = parseInt(findBy); // 去掉小数
			} else {
				return;
			}

			if (findBy > -1) {
				this._queue[findBy] = null;
			}
		}
		/**
   * @summary 清空队列
   * */

	}, {
		key: 'empty',
		value: function empty() {
			this._queue = [];
			this._currIndex = 0;
		}
		/**
   * @summary 队列中是否还有剩余
   * @return  {Boolean}
   * */

	}, {
		key: 'remain',
		value: function remain() {
			return this._currIndex < this._queue.length;
		}
		/**
   * @summary 按顺序返回队列中的 handler
   * @return  {Function|Null}
   * @desc    当队列为空时或到队列末尾时返回 null
   * */

	}, {
		key: 'next',
		value: function next() {
			var result = null,
			    i = this._currIndex,
			    j = this._queue.length;

			if (j) {
				for (; i < j; i++) {
					result = this._queue[i];

					if (result !== null) {
						break;
					}
				}
				if (i !== j) {
					this._currIndex = i + 1;
				}
			}

			return result;
		}
		/**
   * @summary 重置队列
   * */

	}, {
		key: 'reset',
		value: function reset() {
			this._currIndex = 0;
		}
		/**
   * @summary 执行队列中的一个 handler，内部指针将指向下一个 handler
   * @param   {...*}
   * @return  {*}
   * @desc    当出入参数时，参数被视为传入 handler 的参数
   * */

	}, {
		key: 'fire',
		value: function fire() {
			return this.next().apply(undefined, arguments);
		}
		/**
   * @summary 执行队列中的全部 handler，将返回一个结果数组
   * @param   {Object}    [context]
   * @param   {...*}
   * @return  {Array}
   * @desc    当传入参数时，参数被视为传入 handler 的参数（所有 handler 都会传入相同的参数），全部执行后会重置
   * */

	}, {
		key: 'fireAll',
		value: function fireAll(context) {
			var args = arguments;

			this.reset();

			return this._queue.filter(function (d) {
				return d !== null;
			}).map(function (d) {
				return d.apply(undefined, _toConsumableArray(args));
			});
		}
		/**
   * @summary 以 reduce 的形式执行队列中的全部 handler，即前一个 handler 的返回结果作为下一个 handler 的参数
   * @param   {*}         [init]
   * @return  {Promise}
   * @desc    当传入参数时，参数被视为传入第一个 handler 的参数，全部执行后会重置
   *          由于为 reduce 方式调用，将只允许传入一个初始参数，并且原则上所有 handler 都应只有一个参数
   *          由于为 reduce 方式调用，将返回 Promise 类型的结果
   * */

	}, {
		key: 'fireReduce',
		value: function fireReduce(init) {

			this.reset();

			return this._queue.filter(function (d) {
				return d !== null;
			}).reduce(function (promise, d) {
				return promise.then(function (rs) {
					return d(rs);
				});
			}, Promise.resolve(init));
		}
	}]);

	return HandlerQueue;
}();

exports.default = HandlerQueue;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = __webpack_require__(2);

var _model2 = _interopRequireDefault(_model);

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 * @classdesc   WebSocket 接口，与 Model 统一接口，隔离数据与数据来源的问题，在 Model.factory 工厂方法注册为 webSocket，别名 socket，将可以使用工厂方法生成
 * @extends     Model
 * */
var WebSocketModel = function (_Model) {
  _inherits(WebSocketModel, _Model);

  /**
   * @constructor
   * @param   {Object}    [config={}]
   * */
  function WebSocketModel() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebSocketModel);

    var _this = _possibleConstructorReturn(this, (WebSocketModel.__proto__ || Object.getPrototypeOf(WebSocketModel)).call(this, config));

    _this._config = (0, _merge2.default)(config, WebSocketModel._CONFIG);
    return _this;
  }

  return WebSocketModel;
}(_model2.default);

/**
 * 默认配置
 * @static
 * */


WebSocketModel._CONFIG = {};

/**
 * 在 Model.factory 工厂方法注册，将可以使用工厂方法生成
 * */
_model2.default.register('webSocket', WebSocketModel);
/**
 * 注册别名
 * */
_model2.default.registerAlias('webSocket', 'socket');

exports.default = WebSocketModel;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    view    视图功能聚合
 * */

/**
 * @namespace   maple.view
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _resize = __webpack_require__(31);

var _resize2 = _interopRequireDefault(_resize);

var _scroll = __webpack_require__(32);

var _scroll2 = _interopRequireDefault(_scroll);

var _deviceMotion = __webpack_require__(33);

var _deviceMotion2 = _interopRequireDefault(_deviceMotion);

var _message = __webpack_require__(34);

var _message2 = _interopRequireDefault(_message);

var _beforeunload = __webpack_require__(35);

var _beforeunload2 = _interopRequireDefault(_beforeunload);

var _unload = __webpack_require__(36);

var _unload2 = _interopRequireDefault(_unload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// todo ? 实现页面回退刷新
// import pageShow     from './pageShow.js';

/**
 * 统计将用的的事件
 * */
var needRefreshOn = false

/**
 * @summary     设置页面回退时刷新该页面
 * @function
 * @memberOf    maple.view
 * @desc        当 Chrome 由当前页面跳转到下一页面后，浏览回退到当前页面时，页面不会刷新，调用此函数以达成刷新页面的效果
 * */
,
    needRefresh = function needRefresh() {
	if (needRefreshOn) {
		return;
	}

	window.onunload = function () {};
	// window.onpagehide = ()=>{
	// 	window.onpageshow = ()=>{
	// 		location.reload();
	// 	}
	// };

	needRefreshOn = true;
}
/**
 * @summary     获取节点的方位、大小信息
 * @function
 * @memberOf    maple.view
 * @param       {Element}       target
 * @param       {String}        [key]
 * @return      {Object|Number}
 * */
,
    offset = function offset(target, key) {
	var rs = null;

	if ('getBoundingClientRect' in target) {
		rs = target.getBoundingClientRect();

		if (key) {
			rs = rs[key];
		}
	}

	return rs;
}

/**
 * @summary     向其它窗口 或 Web Worker 发送消息
 * @function
 * @memberOf    maple.view
 * @param       {Window|Worker} targetWindow
 * @param       {*}             message
 * @param       {String}        [targetOrigin='*']  * 表示无限制，也可以是一个 url
 * @param       {*}             [transfer]
 * */
,
    postMessage = function postMessage(targetWindow, message) {
	var targetOrigin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '*';
	var transfer = arguments[3];

	targetWindow.postMessage(message, targetOrigin, transfer);
};

/**
 * @exports view
 * */
exports.default = {
	resize: _resize2.default,
	scroll: _scroll2.default,
	deviceMotion: _deviceMotion2.default,
	message: _message2.default

	// , pageShow

	, beforeunload: _beforeunload2.default,
	unload: _unload2.default,

	offset: offset,
	needRefresh: needRefresh,
	postMessage: postMessage
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    全局事件 resize
 *          使用捕捉方式
 * */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _listener = __webpack_require__(0);

/**
 * @memberOf    maple.view
 * @type        {Listener}
 * */
var resize = (0, _listener.listener)('resize', {
  useDebounce: true
});exports.default = resize;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    全局事件 scroll
 *          使用捕捉方式
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _listener = __webpack_require__(0);

/**
 * @memberOf    maple.view
 * @type        {Listener}
 * */
var scroll = (0, _listener.listener)('scroll', {
	useDebounce: true
});

/**
 * @summary     禁止页面滚动
 * @method
 * @memberOf    scroll
 * @param       {Boolean}   disabled
 * */
scroll.disabled = function (disabled) {
	if (disabled) {
		this._overflowState = window.getComputedStyle(document.body).overflow || 'visible';

		document.body.style.overflow = 'hidden';
	} else {
		document.body.style.overflow = this._overflowState || 'visible';
	}
};
/**
 * @summary     设置或读取当前页面滚动条位置
 * @method
 * @memberOf    scroll
 * @param       {String}        offset  获取方位基准，取值为 'top','bottom','left','right' 中一个
 * @param       {String|Number} [value] 设置滚动条的位置
 * @return      {Object|Null}
 * */
scroll.scrollBar = function (offset, value) {
	var argc = arguments.length,
	    body = document.body,
	    doc = document.documentElement,
	    curr = 0,
	    total = 1,
	    view = 1,
	    regexp = /^(\d+(?:\.\d+)?)(%|view)?$/,
	    temp = void 0;

	if (argc === 1) {
		// 读操作

		switch (arguments[0]) {
			case 'top':
				total = body.scrollHeight;
				curr = body.scrollTop;
				view = doc.clientHeight;
				break;
			case 'bottom':
				total = body.scrollHeight;
				view = doc.clientHeight;
				curr = total - body.scrollTop - view;
				break;
			case 'left':
				total = body.scrollWidth;
				curr = body.scrollLeft;
				view = doc.clientWidth;
				break;
			case 'right':
				total = body.scrollWidth;
				view = doc.clientWidth;
				curr = total - body.scrollLeft - view;
				break;
			default:
				break;
		}

		return {
			px: curr,
			percent: Math.floor(curr / total * 100),
			view: parseFloat((curr / view).toFixed(1))
		};
	} else {
		// 写 操作
		temp = regexp.exec(value);

		if (temp) {
			switch (offset) {
				case 'top':
					curr = parseFloat(temp[1]);

					if (temp[2] === '%') {
						// 百分比
						curr = curr * body.scrollHeight / 100;
					} else if (temp[2] === 'view') {
						// 屏数
						curr = curr * doc.clientHeight;
					}

					body.scrollTop = curr;
					break;
				case 'bottom':
					curr = parseFloat(temp[1]);

					if (temp[2] === '%') {
						// 百分比
						curr = Math.max(body.scrollHeight * (1 - curr / 100), 0);
					} else if (temp[2] === 'view') {
						// 屏数
						curr = Math.max(body.scrollHeight - curr * doc.clientHeight, 0);
					}

					body.scrollTop = curr;
					break;
				case 'left':
					curr = parseFloat(temp[1]);

					if (temp[2] === '%') {
						// 百分比
						curr = curr * body.scrollWidth / 100;
					} else if (temp[2] === 'view') {
						// 屏数
						curr = curr * doc.clientWidth;
					}

					body.scrollLeft = curr;
					break;
				case 'right':
					curr = parseFloat(temp[1]);

					if (temp[2] === '%') {
						// 百分比
						curr = Math.max(body.scrollWidth * (1 - curr / 100), 0);
					} else if (temp[2] === 'view') {
						// 屏数
						curr = Math.max(body.scrollWidth - curr * doc.clientWidth, 0);
					}

					body.scrollLeft = curr;
					break;
				default:
					break;
			}
		} else {
			console.log('scrollBar 参数设置错误');
		}
	}
};

exports.default = scroll;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    陀螺仪事件
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _listener = __webpack_require__(0);

/**
 * @memberOf    maple.view
 * @type        {Listener}
 * */
var deviceMotion = null,
    type = '';

if ('DeviceMotionEvent' in window) {
	// 获取陀螺仪加速度
	type = 'devicemotion';
}
// else if( 'DeviceOrientationEvent' in window ){  // 获取旋转信息
// 	eventType = 'deviceorientation';
// }

if (type) {
	deviceMotion = (0, _listener.listener)(type, {
		useDebounce: true
	});
}

exports.default = deviceMotion;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    postMessage 事件
 * */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _listener = __webpack_require__(0);

/**
 * @memberOf    maple.view
 * @type        {Listener}
 * */
var message = (0, _listener.listener)('message');exports.default = message;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _listener = __webpack_require__(0);

/**
 * @memberOf    maple.view
 * @type        {Listener}
 * */
var beforeunload = (0, _listener.listener)('before');

exports.default = beforeunload;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _listener = __webpack_require__(0);

/**
 * @memberOf    maple.view
 * @type        {Listener}
 * */
var unload = (0, _listener.listener)('unload');

exports.default = unload;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = __webpack_require__(11);

var _url2 = _interopRequireDefault(_url);

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

var _listener = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @summary     路由回调函数
 * @callback    RouterEvent
 * @param       {Object}
 * @param       {Object}    params
 * */

/**
 * @class
 * @classdesc
 * @desc        路由配置类
 * */
var Router = function () {
	/**
  * @constructor
  * @param   {Object}    [config={}]
  * */
	function Router() {
		var _this = this;

		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Router);

		this.listener = (0, _listener.listener)(this, 'routerChange', function (e, newUrl, oldUrl) {});

		this.routers = [];

		if ('routers' in config && Array.isArray(config.routers)) {
			config.routers.forEach(function (route) {
				_this.register(route);
			});
		}
	}

	// ---------- 公有方法 ----------
	/**
  * @summary 进入页面初始化 router
  * */


	_createClass(Router, [{
		key: 'init',
		value: function init() {
			var tempUrl = void 0;

			if (_url2.default.hash) {
				tempUrl = _url2.default.parseUrl(_url2.default.hash);

				if (this.has(tempUrl.path)) {
					this.get(tempUrl);
				}
			}
		}
	}, {
		key: 'hash',
		value: function hash() {}
		/**
   * @summary 注册路径
   * @param   {Object|String|RegExp}  route           当 route 为 Object 类型时且不为 RegExp 视为路由配置对象
   * @param   {String|RegExp}         route.path
   * @param   {Function}              route.callback
   * @param   {Array}                 [route.children]
   * @param   {RouterEvent}           [callback]      当 route 为 String 或 RegExp 类型时有效
   * @return  {Router}                this
   * @desc    path 以 / 开始视为根目录开始，否则以当前路径目录下，不能带参数和 hash(? #)
   *          可以配置动态路由，参数名以 :name 的形式
   *          解析出来的路由参数将以组合到出入 RouterEvent 函数的参数 params 中
   *          若存在同名属性则覆盖
   * */

	}, {
		key: 'register',
		value: function register(route, callback) {
			var paramNames = [],
			    pattern = null,
			    path = '';

			// 处理 path
			if ((typeof route === 'undefined' ? 'undefined' : _typeof(route)) === 'object' && !(route instanceof RegExp)) {
				path = route.path;
				callback = route.callback;
			} else {
				path = route;
			}

			// 处理 pattern
			if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path instanceof RegExp) {
				pattern = path;
			} else if (typeof path === 'string') {

				if (!/^\//.test(path)) {
					// 当前目录下
					path = _url2.default.dir + path; // 添加根目录
				}

				pattern = path.replace(/:([^\/]*)/g, function (str, paramName) {
					paramNames.push(paramName);

					return '([^\\\/]+)';
				});

				pattern = new RegExp('^' + pattern + '$');
			}

			// 添加到 routers
			if (pattern) {
				this.routers.push({
					pattern: pattern,
					paramNames: paramNames,
					callback: callback
				});
			}

			// todo 子路由
			if ((typeof router === 'undefined' ? 'undefined' : _typeof(router)) === 'object' && 'children' in router) {
				// this.children = new Router({
				// 	routers: router.children
				// });
			}

			return this;
		}
		/**
   * @summary 跳转到路径
   * @param   {String|Url}        path
   * @param   {Object|Boolean}    [params={}]
   * @desc
   * */

	}, {
		key: 'get',
		value: function get(path) {
			var _this2 = this;

			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var tempUrl = _url2.default.parseUrl(path);

			path = tempUrl.path;

			// return
			// this.routers.reduce((promise, route)=>{
			// 	let result = route.pattern.exec( path )
			// 		, tempParams
			// 		;
			//
			// 	if( result ){    // 存在匹配 path
			//
			// 		// 解析 url 中的参数
			// 		tempParams = route.paramNames.reduce((all, d, i)=>{
			// 			all[d] = result[i +1];
			//
			// 			return all;
			// 		}, {});
			// 		tempParams = merge(tempParams, params);
			//
			// 		if( 'before' in route && typeof route.before === 'function' ){
			// 			promise = promise.then(()=>{
			// 				return new Promise((resolve)=>{
			// 					route.before(url.pack(), path, tempParams, resolve);
			// 				});
			// 			});
			// 		}
			//
			// 		promise = promise.then((exec)=>{
			// 			if( exec ){
			// 				return route.callback( tempParams );
			// 			}
			// 		});
			//
			// 		if( 'after' in route && typeof route.after === 'function' ){
			// 			promise = promise.then(()=>{
			// 				return new Promise((resolve, reject)=>{
			// 					route.after(url.pack(), path, tempParams, (execRemain)=>{
			// 						if( execRemain ){
			// 							resolve();
			// 						}
			// 						else{
			// 							reject();
			// 						}
			// 					});
			// 				});
			// 			});
			// 		}
			// 	}
			//
			// 	return promise;
			// }, Promise.resolve());

			return this.routers.map(function (route) {
				var result = route.pattern.exec(path),
				    temp = void 0;

				if (result) {
					// 存在匹配 path
					// 解析 url 中的参数
					temp = result.slice(1).reduce(function (all, d, i) {
						all[route.paramNames[i]] = d;

						return all;
					}, {});

					temp = (0, _merge2.default)(temp, params);

					try {
						// 执行路由程序

						route.callback(temp);

						_this2.listener.trigger(_url2.default.pack(), tempUrl.pack());
					} catch (e) {
						console.log(path, '路由执行错误', e);
					}
				}

				return !!result;
			}).some(function (d) {
				return d;
			});
		}
		/**
   * @summary 判断已注册的路由中是否有匹配该路径
   * @param   {String}    path
   * @return  {Boolean}
   * */

	}, {
		key: 'has',
		value: function has(path) {
			return this.routers.some(function (route) {
				return route.pattern.test(path);
			});
		}
	}]);

	return Router;
}();

var router = new Router();

_url2.default.popState.add(function () {
	var rs = router.get(location.href);

	if (!rs) {
		console.log('router 中不存在', location.href);
	}
});

exports.default = router;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @file    对地理定位接口进行封装
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @summary     获取定位信息
 * @function    position
 * @param       {Object}    [options={}]                        定位接口的参数
 * @param       {Boolean}   [options.enableHighAccuracy=false]  是否浏览器获取高精度的位置
 * @param       {Number}    [options.timeout=2000]              超时时间，单位毫秒
 * @param       {Number}    [options.maximumAge=5000]           最长有效期
 * @return      {Promise}
 * */
var position = function position() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var result = void 0;

	if ('geolocation' in navigator) {
		result = new Promise(function (resolve, reject) {
			var opts = (0, _merge2.default)(options, position._CONFIG);

			navigator.geoposition.getCurrentPosition(resolve, reject, opts);
		});
	} else {
		result = Promise.reject(new Error('您的浏览器不支持地理定位功能'));
	}

	return result;
};

position._CONFIG = {
	// 指示浏览器获取高精度的位置，默认为 false
	enableHighAccuracy: true
	// 指定获取地理位置的超时时间，默认不限时，单位为毫秒
	, timeout: 2000
	// 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置
	, maximumAge: 5000
};

/**
 * @exports position
 * */
exports.default = position;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @namespace   maple.animate
 * */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queue = exports.animator = undefined;

var _animator = __webpack_require__(12);

var _animator2 = _interopRequireDefault(_animator);

var _queue = __webpack_require__(40);

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.animator = _animator2.default;
exports.queue = _queue2.default;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _animator = __webpack_require__(12);

var _animator2 = _interopRequireDefault(_animator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimationQueue = function () {
	function AnimationQueue(animators) {
		_classCallCheck(this, AnimationQueue);

		this.animators = animators || [];
	}

	_createClass(AnimationQueue, [{
		key: 'append',
		value: function append() {
			this.animators.push.apply(this.animators, arguments);
		}
	}, {
		key: 'flush',
		value: function flush() {
			var self = this;

			if (this.animators.length) {
				(function play() {
					var animator = self.animators.shift();

					if (animator instanceof _animator2.default) {
						animator.start(function () {
							if (self.animators.length) {
								play();
							}
						});
					} else {
						animator.apply(self);

						if (self.animators.length) {
							play();
						}
					}
				})();
			}
		}
	}]);

	return AnimationQueue;
}();

exports.default = AnimationQueue;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module  register
 * */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _serviceWorker = __webpack_require__(42);

var _serviceWorker2 = _interopRequireDefault(_serviceWorker);

var _webWorker = __webpack_require__(43);

var _webWorker2 = _interopRequireDefault(_webWorker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  serviceWorker: _serviceWorker2.default,
  webWorker: _webWorker2.default
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @summary     注册 Service Worker
 * @function    registerServiceWorker
 * @param       {Object}    [options={}]
 * @param       {String}    options.file
 * @return      {Promise}   返回一个 Promise 对象，在 resolve 时传入 true
 * */
function registerServiceWorker() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var config = (0, _merge2.default)(options, registerServiceWorker._CONFIG);

	return new Promise(function (resolve, reject) {
		if ('serviceWorker' in navigator) {
			if (!(config.file in registerServiceWorker._CACHE)) {

				registerServiceWorker._CACHE[config.file] = navigator.serviceWorker.register(config.file, {
					scope: config.scope
				}).then(function (regist) {
					var serviceWorker = void 0;

					if (regist.installing) {
						serviceWorker = regist.installing;
					} else if (regist.waiting) {
						serviceWorker = regist.waiting;
					} else if (regist.active) {
						serviceWorker = regist.active;
					}

					if (serviceWorker) {
						// todo 用途
						serviceWorker.addEventListener('statechange', function (e) {
							console.log(e);
						});
					}

					return true;
				}).catch(function (e) {
					console.log(e);
				});

				navigator.serviceWorker.ready.then(function (reg) {
					reg.pushManager.getSubscription().then(function (res) {
						if (!res) {
							reg.pushManager.subscribe({
								userVisibleOnly: true
							}).then(function (sub) {
								console.log('Subscribed! Endpoint', sub.endpoint);
							});
						} else {
							console.log('remain endpoint', res.endpoint);
						}
					});
				});
			}

			resolve(registerServiceWorker._CACHE[config.file]);
		} else {
			reject(new Error('该浏览器不支持 Service Worker'));
		}
	});

	// return result;
}

registerServiceWorker._CACHE = {};

registerServiceWorker._CONFIG = {
	file: 'sw.js',
	scope: './'
};

exports.default = registerServiceWorker;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _merge = __webpack_require__(1);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 运行 Web Worker
 * @function    registerWebWorker
 * @param   {Object}    [options={}]
 * @param   {String}    options.file
 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传入生成的 Web Worker 实例
 * */
function registerWebWorker() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var config = (0, _merge2.default)(options, registerWebWorker._CONFIG);

	return new Promise(function (resolve, reject) {
		if ('Worker' in self) {

			if (!(config.file in registerWebWorker._WORKER_CACHE)) {
				registerWebWorker._WORKER_CACHE[config.file] = new Worker(config.file);
			}

			resolve(registerWebWorker._WORKER_CACHE[config.file]);
		} else {
			reject(new Error('您的浏览器不支持 Web Worker'));
		}
	});
}

registerWebWorker._WORKER_CACHE = {};

registerWebWorker._CONFIG = {
	file: 'ww.js'
};

exports.default = registerWebWorker;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 显示桌面通知
 * @function    notify
 * @param   {String}    title
 * @param   {String}    content
 * */

Object.defineProperty(exports, "__esModule", {
	value: true
});
var notify = function notify(title, content) {};

if ('Notification' in self) {
	notify = function notify(title, content) {
		var Notify = self.Notification,
		    notification = void 0,
		    permission = void 0;

		//判断浏览器是否已允许桌面提醒
		if (Notify.permission === 'granted') {
			// 已允许
			permission = Promise.resolve();
		} else {
			// 用户未设置
			permission = Notify.requestPermission();
		}

		permission.then(function () {

			return new Promise(function (resolve) {
				notification = new Notify(title, {
					icon: '/image/favicon.ico',
					body: content
				});

				notification.onclick = function () {
					notification.close();

					resolve();
				};
			});
		});
	};
}
/**
 * 取消对旧版本兼容
 * */
// else if( 'webkitNotifications' in self ){    // 兼容旧版本 chrome
// 	notify = function(title, content){
// 		let Notify = self.webkitNotifications;
//
// 		// 判断浏览器是否已允许桌面提醒
// 		if( Notify.checkPermission() === 0 ){	// 已允许
//
// 			Notify.createNotification('/image/favicon.ico', title, content).show();
// 		}
// 		else{	// 未允许
// 			Notify.requestPermission();
// 		}
// 	};
// }
// else if( 'mozNotifications' in navigator ){
// 	notify = function(title, content){
// 		return navigator.mozNotification.createNotification(title, content, '/image/favicon.ico').show();
// 	}
// }
else {
		notify = function notify() {
			return Promise.reject();
		};
	}

exports.default = notify;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ })
/******/ ]);
//# sourceMappingURL=v.js.map