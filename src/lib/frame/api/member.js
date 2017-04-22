'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';
import domain       from '../domain.js';
import validate     from '../util/validate.js';

/**
 * @class
 * @classdesc   会员业务模块，二/三级域名 mserv，在 Model.factory 工厂方法注册为 member，将可以使用工厂方法生成
 * @extends     ServiceModel
 * */
class MemberServiceModel extends ServiceModel{
	/**
	 * @constructor
	 * @param   {Object}    [config={}]
	 * */
	constructor(config={}){
		super( config );

		this._config.domainList = ['mserv'];  // 子域名

		if( !domain.isOnline ){
			this._config.domainList.push( domain.env );
		}

		this._config.domainList.push( domain.host );

		this._config.baseUrl = '//'+ this._config.domainList.join('.');
	}

	/**
	 * @summary 防黄牛
	 * @param   {Boolean}   [ignoreLogin=false] 是否忽略登录
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/app/secKey]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1931}
	 * */
	secKey(ignoreLogin=false){
		let data = {}
			;

		if( ignoreLogin ){
			data.ignoreLogin = ignoreLogin
		}

		return this.setData('/publics/app/secKey', {
			data
		});
	}

	/**
	 * @summary 创建新会员卡
	 * @param   {String}        phone
	 * @param   {Number|String} storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果，如果未传参数会返回 []
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/createCard]{@link http://dev.51tiangou.com/interfaces/detail.html?id=275}
	 * */
	createCard(phone, storeId){
		let result
			;

		if( phone && storeId && validate.checkNumberListFormat(storeId) ){
			result = this.getData('/publics/memberCard/createCard', {
				data
			});
		}
		else{
			result = Promise.resolve([]);
		}

		return result;
	}
	/**
	 * @summary 我的正常卡
	 * @param   {String}    phone
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/myCard]{@see http://dev.51tiangou.com/interfaces/detail.html?id=271}
	 * @todo    查接口存在 token,storeIds 参数，但没有 phone 参数
	 * */
	mycard(phone){
		return this.getData('/publics/memberCard/myCard', {
			data: {
				phone
			}
		});
	}
	/**
	 * @summary 我的已绑定卡
	 * @param   {Number|String} [storeIds]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    当填入 storeIds 会只请求到 storeIds 下的会员卡，如果填入的 storeIds 在天狗不存在则按照 storeIds=null 来处理
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/myCard/bound]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1789}
	 * */
	myBindCard(storeIds){
		let data = {}
			;

		if( storeIds ){
			data.storeIds = storeIds;
		}

		return this.getData('/publics/memberCard/myCard/bound', {
			data
		});
	}
	/**
	 * @summary 我的未绑定卡
	 * @param   {Number|String} [storeIds]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    当填入 storeIds 会只请求到 storeIds 下的会员卡，如果填入的 storeIds 在天狗不存在则按照 storeIds=null 来处理
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/myCard/unbound]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1791}
	 * */
	myUnbindCard(storeIds){
		let data = {}
			;

		if( storeIds ){
			data.storeIds = storeIds;
		}

		return this.getData('/publics/memberCard/myCard/unbound', {
			data
		});
	}
	/**
	 * @summary 我的异常卡
	 * @param   {String}    phone
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/unNormalCards]{@link http://dev.51tiangou.com/interfaces/detail.html?id=289}
	 * */
	queryUnusualCard(phone){
		return this.getData('/publics/memberCard/unNormalCards', {
			data: {
				phone
			}
		});
	}
	/**
	 * @summary 我的可用会员卡
	 * @param   {Number}    [pageCount=999]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/myUsableCard]{@link http://dev.51tiangou.com/interfaces/detail.html?id=277}
	 * */
	myUsableCard(pageCount=999){
		return this.getData('/publics/memberCard/myUsableCard', {
			data: {
				pageCount
			}
		});
	}
	/**
	 * @summary 会员卡是否可以开通
	 * @param   {Number|String} storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/store/cardCreateAble]{@link http://dev.51tiangou.com/interfaces/detail.html?id=287}
	 * */
	cardCreateAble(storeId){
		let result
		;

		if( storeId ){
			result = this.getData('/publics/memberCard/store/cardCreateAble', {
				data: {
					storeId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 有支付功能卡查询
	 * @param   {String}    phone
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/store/supportPay]{@link http://dev.51tiangou.com/interfaces/detail.html?id=281}
	 * */
	supportPayCard(phone){
		return this.getData('/publics/memberCard/store/supportPay', {
			data: {
				phone
			}
		});
	}
	/**
	 * @summary 我的会员积分明细
	 * @param   {Number|String} cid                     会员卡 id
	 * @param   {Number}        groupId                 归属，1.大商，3.友好
	 * @param   {Object}        [options={}]            分页参数
	 * @param   {Number}        [options.startNum=0]
	 * @param   {Number}        [options.pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/integral/history/query]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1699}
	 * */
	queryHistory(cid, groupId, options={}){
		let data = {
				cid
				, groupId
			}
		;

		data.startNum = options.startNum || 0;
		data.pageCount = options.pageCount || 10;

		return this.setData('/publics/memberCard/integral/history/query', {
			data: {
				cid
				, groupId
			}
		});
	}
	/**
	 * @summary 查询消费记录
	 * @param   {Number|String} cid
	 * @param   {Number|String} groupId 归属，1.大商，3.友好
	 * @param   {Number}        [startNum=0]
	 * @param   {Number}        [pageCount=10]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/consume/history/query]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2551}
	 * */
	queryConsume(cid, groupId, startNum=0, pageCount=10){
		return this.setData('/publics/memberCard/consume/history/query', {
			data: {
				cid
				, groupId
				, startNum
				, pageCount
			}
		});
	}
	/**
	 * @summary 店铺所有会员卡
	 * @param   {Number|String} storeId     门店 id
	 * @param   {Number|String} [counterId]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/storeToCard]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3041}
	 * */
	storeToCard(storeId, counterId){
		let data = {
				storeId
			}
		;

		if( counterId ){
			data.counterId = counterId;
		}

		return this.setData('/publics/memberCard/storeToCard', {
			data
		});
	}
	/**
	 * @summary 会员卡相关 - 会员卡绑定
	 * @param   {Number|String} cid             会员卡号
	 * @param   {String}        memberName      会员姓名，大商必填
	 * @param   {String}        identityCode    身份证号码，大商必填
	 * @param   {Number}        groupId         归属，1.大商，3.友好
	 * @param   {String}        phone
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/bind]{@link http://dev.51tiangou.com/interfaces/detail.html?id=283}
	 * */
	bind(cid, memberName, identityCode, groupId, phone){
		let result
		;

		if( cid && memberName && identityCode ){
			result = this.setData('/publics/memberCard/bind', {
				data: {
					cid
					, memberName
					, identityCode
					, groupId
					, phone
				}
			});
		}
		else{
			result = Promise.resolve([]);
		}

		return result;
	}
	/**
	 * @summary 会员卡相关 - 会员解除绑定会员卡
	 * @param   {Number|String} cid
	 * @param   {Number|String} groupId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果，若未传 cid 则返回 resolve([])
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/unbind]{@link http://dev.51tiangou.com/interfaces/detail.html?id=285}
	 * */
	unbind(cid, groupId){
		let result
		;

		if( cid ){
			result = this.getData('/publics/memberCard/unbind', {
				data: {
					cid
					, groupId
				}
			});
		}
		else{
			result = Promise.resolve([]);
		}

		return result;
	}
	/**
	 * @summary 会员卡相关 - 二次绑定接口
	 * @param   {Number}    cid
	 * @param   {Number}    groupId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/bind/noValidate]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2927}
	 * */
	noValidate(cid, groupId){
		return this.setData('/publics/memberCard/bind/noValidate', {
			data: {
				cid
				, groupId
			}
		});
	}
	/**
	 * @summary 会员卡相关 - 查询当前店铺会员卡绑定状态
	 * @param   {Number}    storeId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/cidBind]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3107}
	 */
	cidBind(storeId){
		return this.setData('/publics/memberCard/cidBind', {
			data: {
				storeId
			}
		});
	}
	/**
	 * 查询优惠券
	 * @param   {Number|String} cid
	 * @param   {Object}        [options={}]
	 * @param   {Number|String} [options.storeCode] 店铺编码
	 * @param   {Number|String} [options.groupId]   1.大商，2.友好
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberCard/coupon/query]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2675}
	 * */
	couponQuery(cid, options={}){
		let data = {
				cid
			}
			;

		if( options.storeCode ){
			data.storeCode = options.storeCode;
		}
		if( options.groupId ){
			data.groupId = options.groupId;
		}

		return this.getData('/publics/memberCard/coupon/query', {
			data
		});
	}

	/**
	 * @summary 门店详情页
	 * @param   {Object}        data
	 * @param   {Number|String} [data.cid]      会员卡号
	 * @param   {Number|String} [data.storeId]
	 * @param   {Number}        [data.groupId]  集团编码，1.大商，2.友好
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    cid storeId 必须传一个
	 * @see     [http://mserv.test.66buy.com.cn/publics/storeCardInfo/getName]{@link http://dev.51tiangou.com/interfaces/detail.html?id=265}
	 * */
	storeCardInfo(data){
		let result
			;

		if( data.cid || (data.storeId && validate.checkNumberListFormat(data.storeId)) ){
			result = this.getData('/publics/storeCardInfo/getName', {
				data
			});
		}
		else{
			result = Promise.resolve([]);
		}

		return result;
	}

	/**
	 * @summary 会员卡图标信息
	 * @param   {Number|String|Array}   [storeIdList=[]]
	 * @return  {Promise}               返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/store/storeConf]
	 * @todo    接口中心未查到
	 * @todo    isCheckLogin=false 不检查登录
	 * */
	storeConf(storeIdList=[]){
		return this.getData('/publics/store/storeConf', {
			data: {
				storeIdList
			}
		});
	}
	/**
	 * @summary 查询单笔最大可使用积分
	 * @param   {Number|String} storeId     门店 id
	 * @param   {Number|String} [counterId]
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/store/conf/score/limit]{@link http://dev.51tiangou.com/interfaces/detail.html?id=577}
	 * */
	scoreLimit(storeId, counterId){
		let data = {
				storeId
			}
		;

		if( counterId ){
			data.counterId = counterId
		}

		return this.getData('/publics/store/conf/score/limit', {
			data
		});
	}

	/**
	 * @summary 会员签到
	 * @param   {Number|String} storeId
	 * @param   {Number|String} cardId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/signRecord/signin]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1921}
	 * @todo    使用防黄牛机制
	 * */
	signin(storeId, cardId){
		let result
			;

		if( storeId && validate.checkNumberListFormat(storeId) ){
			result = this.getData('/publics/signRecord/signin', {
				data: {
					storeId
					, cardId
				}
			});
		}
		else{
			result = Promise.resolve([]);
		}

		return result;
	}

	/**
	 * @summary 积分兑换（废弃）
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/storeExChangeItem/list]
	 * @deprecated
	 * @todo    目前没有调用
	 * @todo    接口中心未查到
	 * */
	storeExchangeItem(){
		return this.getData('/publics/storeExChangeItem/list');
	}

	/**
	 * @summary 增加收货地址
	 * @param   {String}        buyerName       收货人姓名
	 * @param   {String}        cellPhone       收货人电话
	 * @param   {Number|String} cityId
	 * @param   {String}        street          详细地址
	 * @param   {Boolean}       isDefault       是否默认
	 * @param   {Number|String} [districtId]    区 id
	 * @param   {String}        [postCode]      邮编
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberAddress/addMemberAddress]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1759}
	 * */
	addMemberAddress(buyerName, cellPhone, cityId, street, isDefault, districtId, postCode){
		let data = {
				buyerName
				, cellPhone
				, cityId
				, street
				, isDefault
			}
			;

		if( districtId ){
			data.districtId = districtId;
		}
		if( postCode ){
			data.postCode = postCode;
		}

		return this.setData('/publics/memberAddress/addMemberAddress', {
			data
		});
	}
	/**
	 * @summary 收货地址查询
	 * @param   {Boolean}   [isDefault] 是否查询默认地址
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberAddress/list]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3425}
	 * */
	addMemberList(isDefault){
		let data = {}
			;

		if( isDefault ){
			data.isDefault = isDefault;
		}

		return this.getData('/publics/memberAddress/list', {
			data
		});
	}
	/**
	 * @summary 加载所有配送地址
	 * @param   {Boolean}   isDefault
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    与 addMemberList 调用相同接口，调整为内部调用 addMemberList
	 * @see     [addMemberList]{@link MemberServiceModel#addMemberList}
	 * */
	memberAddressList(isDefault){
		return this.addMemberList(isDefault);
	}
	/**
	 * @summary 收货地址添加默认
	 * @param   {Number|String} id  收货地址 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberAddress/new/default]
	 * @todo    接口中心未查到
	 * */
	addMemberDefault(id){
		return this.setData('/publics/memberAddress/new/default', {
			data: {
				id
			}
		});
	}
	/**
	 * @summary 删除收货地址
	 * @param   {Number|String} id  收货地址 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberAddress/delete]
	 * @todo    接口中心未查到
	 * */
	addMemberDelete(id){
		return this.setData('/publics/memberAddress/delete', {
			data: {
				id
			}
		});
	}
	/**
	 * @summary 更新收货地址
	 * @param   {Number|String} id              收货地址 id
	 * @param   {String}        buyerName       收货人姓名
	 * @param   {String}        cellPhone       收货人电话
	 * @param   {Number|String} cityId
	 * @param   {String}        street          详细地址
	 * @param   {Boolean}       isDefault       是否默认
	 * @param   {Number|String} [districtId]    区 id
	 * @param   {String}        [postCode]      邮编 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberAddress/update]
	 * @todo    接口中心未查到
	 * */
	addMemberUpdate(id, buyerName, cellPhone, cityId, street, isDefault, districtId, postCode){
		let data = {
				id
				, buyerName
				, cellPhone
				, cityId
				, street
				, isDefault
			}
			;

		if( districtId ){
			data.districtId = districtId;
		}
		if( postCode ){
			data.postCode = postCode;
		}

		return this.setData('/publics/memberAddress/update', {
			data
		});
	}
	/**
	 * @summary 通过收货地址 id 查询收货地址
	 * @param   {Number|String} addressId   收货地址 id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberAddress/getById]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3345}
	 * */
	getAddressById(addressId){
		return this.getData('/publics/memberAddress/getById', {
			data: {
				addressId
			}
		});
	}

	/**
	 * @summary 登录
	 * @param   {String}    cellPhone
	 * @param   {String}    password
	 * @param   {Boolean}   [app=false]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/login]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1747}
	 * */
	login(cellPhone, password, app=false){
		return this.setData('/publics/login', {
			data: {
				cellPhone
				, password
				, app
			}
		});
	}
	/**
	 * @summary 退出登录
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/login/logout]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1749}
	 * */
	logout(){
		return this.getData('/publics/login/logout');
	}
	/**
	 * @summary 升级账户
	 * @param   {String}    cellPhone
	 * @param   {String}    password
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/login/updateVIP]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1753}
	 * @todo    目前没有调用
	 * */
	updateVIP(cellPhone, password){
		return this.getData('/publics/login/updateVIP', {
			data: {
				cellPhone
				, password
			}
		});
	}

	/**
	 * @summary 更改密码
	 * @param   {String}    oldPwd
	 * @param   {String}    password
	 * @param   {String}    code        验证码
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/updatePwd]{@link http://dev.51tiangou.com/interfaces/detail.html?id=2811}
	 * */
	updatePwd(oldPwd, password, code){
		return this.setData('/publics/member/updatePwd', {
			data: {
				oldPwd
				, password
				, code
			}
		});
	}
	/**
	 * @summary 获取用户信息
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/info]
	 * @todo    接口中心未查到
	 * @todo    isCheckLogin=false
	 * */
	memberInfo(){
		return this.getData('/publics/member/info');
	}
	/**
	 * 加载用户信息，使用 POST 方法
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/memberProfile]
	 * @todo    接口中心未查到
	 * */
	memberProfile(){
		return this.setData('/publics/member/memberProfile');
	}
	/**
	 * @summary 更新电话号
	 * @param   {String}    password
	 * @param   {String}    newCellphone
	 * @param   {String}    oldCellphone
	 * @param   {String}    verifyCode      验证码
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/update/cellphone]
	 * @todo    接口中心未查到
	 * @todo    未用 POST 方式？
	 * */
	memberCellphone(password, newCellphone, oldCellphone, verifyCode){
		return this.getData('/publics/member/update/cellphone', {
			data: {
				password
				, newCellphone
				, oldCellphone
				, verifyCode
			}
		});
	}
	/**
	 * @summary 更新昵称
	 * @param   {String}    nickname
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/update/nickname]
	 * @todo    接口中心未查到
	 * */
	memberNickname(nickname){
		return this.setData('/publics/member/update/nickname', {
			data: {
				nickname
			}
		});
	}
	/**
	 * @summary 更新 email（未用）
	 * @param   {String}    email   猜测必然有 email
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/update/email]
	 * @todo    接口中心未查到
	 * @todo    目前没有调用到
	 * */
	memberEmail(email){
		return this.getData('/publics/member/update/email', {
			data: {
				email
			}
		});
	}
	/**
	 * @summary 更新生日
	 * @param   {String}    birthday    格式 YYYY-MM-DD
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/update/birthday]
	 * @todo    接口中心未查到
	 * */
	memberBirthday(birthday){
		return this.setData('/publics/member/update/birthday', {
			data: {
				birthday
			}
		});
	}
	/**
	 * @summary 更新性别
	 * @param   {String}    sex
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/update/sex]
	 * @todo    接口中心未查到
	 * */
	memberSex(sex){
		return this.setData('/publics/member/update/sex', {
			data: {
				sex
			}
		});
	}
	/**
	 * @summary 获取结算码
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/memberCode/get]
	 * @todo    接口中心未查到
	 * */
	memberCode(){
		return this.getData('/publics/member/memberCode/get');
	}
	/**
	 * @summary 短信跳转会员注册页接口
	 * @param   {String}    offlineId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/decodeMember]
	 * @todo    接口中心未查到
	 * */
	decodeMember(offlineId){
		return this.getData('/publics/member/decodeMember', {
			data: {
				offlineId
			}
		});
	}
	/**
	 * @summary 会员是否关注了某专柜
	 * @param   {Number|String} counterId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/counter/havAttention]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1495}
	 * */
	havAttention(counterId){
		let result
		;

		if( counterId ){
			result = this.setData('/publics/member/counter/havAttention', {
				data: {
					counterId
				}
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 关注专柜或者取消关注
	 * @param   {Number}        state       1.关注，其它.取消关注
	 * @param   {Number|String} counterId
	 * @param   {Number|String} storeId
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/counter/attention]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1497}
	 * */
	attention(state, counterId, storeId){
		return this.setData('/publics/member/counter/attention', {
			data: {
				state
				, counterId
				, storeId
			}
		});
	}
	/**
	 * @summary 我的关注
	 * @param   {Object}    [data={}]
	 * @param   {Number}    [data.startNum=0]
	 * @param   {Number}    [data.pageCount=10]
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/counter/myAttention]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1583}
	 * */
	myAttention(data={}){

		data.startNum = data.startNum || 0;
		data.pageCount = data.pageCount || 10;

		return this.setData('/publics/member/counter/myAttention', {
			data
		});
	}
	/**
	 * @summary 修改微信账号
	 * @param   {String}    wechatId
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/update/wechatId]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1803}
	 * */
	updateWechatId(wechatId){
		return this.setData('/publics/member/update/wechatId', {
			data: {
				wechatId
			}
		});
	}
	/**
	 * @summary 更新头像
	 * @param   {String}    imageUrl
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/update/photo]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1801}
	 * */
	updatePhone(imageUrl){
		return this.setData('/publics/member/update/photo', {
			data: {
				imageUrl
			}
		});
	}
	/**
	 * @summary 获取结算码弹窗情况
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/member/openState]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3219}
	 * */
	openState(){
		return this.getData('/publics/member/openState');
	}

	/**
	 * @summary 获取我的账户信息
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/info]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1805}
	 * */
	mineInfo(){
		return this.getData('/publics/mine/info');
	}
	/**
	 * @summary 当前输入密码信息
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/payPwd/info]
	 * @todo    接口中心未查到
	 * */
	minePayPwd(){
		return this.getData('/publics/mine/payPwd/info');
	}
	/**
	 * @summary 验证支付密码
	 * @param   {String}    payPassword 支付密码
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/payPassword/verify]
	 * @todo    接口中心未查到
	 * */
	mineVerify(payPassword){
		return this.setData('/publics/mine/payPassword/verify', {
			data: {
				payPassword
			}
		});
	}
	/**
	 * @summary 设置支付密码
	 * @param   {String}    payPassword
	 * @param   {String}    newPassword
	 * @param   {String}    confirmPassword
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/payPassword/set]
	 * @todo    接口中心未查到
	 * */
	mineSet(payPassword, newPassword, confirmPassword){
		return this.setData('/publics/mine/payPassword/set', {
			data: {
				payPassword
				, newPassword
				, confirmPassword
			}
		});
	}
	/**
	 * @summary 我的问题
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/mySecurityQuestion]
	 * @todo    接口中心未查到
	 * */
	mineQuestion(){
		return this.getData('/publics/mine/mySecurityQuestion');
	}
	/**
	 * @summary 获取密保问题
	 * @param   {Boolean}   first
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/securityQuestion/all]
	 * @todo    接口中心未查到
	 * */
	mineQuestionAll(first){
		return this.getData('/publics/mine/securityQuestion/all', {
			data: {
				first
			}
		});
	}
	/**
	 * @summary 未知接口
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/securityQuestion/validate]
	 * @todo    接口中心未查到
	 * */
	mineValidate(){
		return this.getData('/publics/mine/securityQuestion/validate');
	}
	/**
	 * @summary 设置密保问题
	 * @param   {String}    questions   问题答案组合的数组的序列化
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    参数格式 [{fkSecurityQuestionId, securityAnswer}, {}]，使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/securityQuestion/set]
	 * @todo    接口中心未查到
	 * */
	mineSecurityQuestion(questions){
		return this.setData('/publics/mine/securityQuestion/set', {
			data: {
				questions
			}
		});
	}
	/**
	 * @summary 验证手机验证码
	 * @param   {String}    code
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/securityCellphone/validate]
	 * @todo    接口中心未查到
	 * */
	mineSecurityCellphone(code){
		return this.setData('/publics/mine/securityCellphone/validate', {
			data: {
				code
			}
		});
	}
	/**
	 * @summary 设置密保手机
	 * @param   {String}    cellPhone
	 * @param   {String}    preCode
	 * @param   {String}    newCode
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/securityCellphone/set]
	 * @todo    接口中心未查到
	 * */
	mineSecurityCellphoneSet(cellPhone, preCode, newCode){
		return this.setData('/publics/mine/securityCellphone/set', {
			data: {
				cellPhone
				, preCode
				, newCode
			}
		});
	}
	/**
	 * @summary 验证手机验证码跳转密保验证或直接设置支付密码
	 * @param   {String}    code
	 * @param   {String}    identifyNumber
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/findPayPwd/firststep]
	 * @todo    接口中心未查到
	 * */
	mineFirststep(code, identifyNumber){
		let data = {
				code
			}
			;

		if( identifyNumber ){
			data.identifyNumber = identifyNumber;
		}

		return this.setData('/publics/mine/findPayPwd/firststep', {
			data
		});
	}
	/**
	 * @summary 设置支付密码第二步
	 * @param   {String}    code
	 * @param   {String}    answers
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/findPayPwd/secondstep]
	 * @todo    接口中心未查到
	 * */
	mineSecondstep(code, answers){
		return this.setData('/publics/mine/findPayPwd/secondstep', {
			data: {
				code
				, answers
			}
		});
	}
	/**
	 * @summary 发送验证码
	 * @param   {Object}    data
	 * @param   {String}    [data.cellPhone]
	 * @param   {Number}    [data.smsVoiceType]  值为 1 时为语音验证码
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    cellPhone 和 smsVoiceTYpe 必须传一个
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/securityCellphone/sendCode]
	 * @todo    接口中心未查到
	 * */
	mineSendCode(data){
		let result
		;

		if( data.cellPhone || data.smsVoiceType ){
			result = this.getData('/publics/mine/securityCellphone/sendCode', {
				data
			});
		}
		else{
			result = Promise.reject();
		}

		return result;
	}
	/**
	 * @summary 发送验证码（新）
	 * @param   {String}    cellPhone
	 * @param   {Number}    smsVoiceType    值为 1 时为语音验证码
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    与 mineSendCode 调用相同接口
	 * @see     [http://mserv.test.66buy.com.cn/publics/mine/newSecurityCellphone/sendCode]
	 * @todo    接口中心未查到
	 * */
	mineNewSendCode(cellPhone, smsVoiceType){
		let data = {
				cellPhone
			}
		;

		if( smsVoiceType ){
			data.smsVoiceType = smsVoiceType;
		}

		return this.getData('/publics/mine/newSecurityCellphone/sendCode', {
			data
		});
	}
	
	/**
	 * @summary 注册
	 * @param   {String}        cellPhone
	 * @param   {String}        password
	 * @param   {String}        code
	 * @param   {Number|String} [sourceType=3]          注册来源，1.微信，2.订阅号，3.web，4.Android，5.iOS
	 * @param   {Object}        [options={}]
	 * @param   {String}        [options.inviteCode]    要求码？
	 * @param   {Number|String} [options.fkCityId]      注册城市
	 * @param   {Number|String} [options.defaultCityId] 默认城市 id
	 * @param   {Number|String} [options.sourceShopId]  来源店铺
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/register]{@link http://dev.51tiangou.com/interfaces/detail.html?id=955}
	 * @todo    接口中心没有 inviteCode 参数，是否存在
	 * */
	registerIn(cellPhone, password, code, sourceType=3, options={}){
		let data = {
				cellPhone
				, password
				, code
				, sourceType
			}
			;

		if( options.inviteCode ){
			data.inviteCode = options.inviteCode;
		}
		if( options.fkCityId ){
			data.fkCityId = options.fkCityId;
		}
		if( options.defaultCityId ){
			data.defaultCityId = options.defaultCityId;
		}
		if( options.sourceShopId ){
			data.sourceShopId = options.sourceShopId;
		}

		return this.setData('/publics/register', {
			data
		});
	}
	/**
	 * @summary 验证验证码
	 * @param   {String}    cellphone
	 * @param   {String}    code
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/register/validateCode]{@link http://dev.51tiangou.com/interfaces/detail.html?id=961}
	 * */
	registerValidateCode(cellphone, code){
		return this.setData('/publics/register/validateCode', {
			data: {
				cellphone
				, code
			}
		});
	}
	/**
	 * @summary 手机验证码发送
	 * @param   {String}    cellPhone
	 * @param   {String}    regiCode
	 * @param   {Number}    smsVoiceType    值为 1 时为语音验证码
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/register/sendCode]
	 * @todo    接口中心未查到
	 * */
	registerSendCode(cellPhone, regiCode, smsVoiceType){
		let data = {
				cellPhone
			}
			;

		if( regiCode ){
			data.regiCode = regiCode;
		}
		if( smsVoiceType ){
			data.smsVoiceType = smsVoiceType;
		}

		return this.getData('/publics/register/sendCode', {
			data
		});
	}
	/**
	 * @summary 手机验证码发送
	 * @param   {String}    cellPhone
	 * @param   {Number}    smsVoiceType    值为 1 时为语音验证码
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/register/sendAuthCode]
	 * @todo    接口中心未查到
	 * */
	registerSendAuthCode(cellPhone, smsVoiceType){
		let data = {
				cellPhone
			}
			;

		if( smsVoiceType ){
			data.smsVoiceType = smsVoiceType;
		}

		return this.getData('/publics/register/sendAuthCode', {
			data
		});
	}
	/**
	 * @summary 重新设置密码
	 * @param   {String}        cellPhone
	 * @param   {String}        password
	 * @param   {String}        code
	 * @param   {Number|String} [sourceType=3]          注册来源，1.微信，2.订阅号，3.web，4.Android，5.iOS
	 * @param   {Object}        [options={}]
	 * @param   {String}        [options.inviteCode]    要求码？
	 * @param   {Number|String} [options.fkCityId]      注册城市
	 * @param   {Number|String} [options.defaultCityId] 默认城市 id
	 * @param   {Number|String} [options.sourceShopId]  来源店铺
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/register/forgetPwd]
	 * @todo    接口中心未查到
	 * */
	registerForgetPwd(cellPhone, password, code, sourceType=3, options){
		let data = {
				cellPhone
				, password
				, code
				, sourceType
			}
			;

		if( options.inviteCode ){
			data.inviteCode = options.inviteCode;
		}
		if( options.fkCityId ){
			data.fkCityId = options.fkCityId;
		}
		if( options.defaultCityId ){
			data.defaultCityId = options.defaultCityId;
		}
		if( options.sourceShopId ){
			data.sourceShopId = options.sourceShopId;
		}

		return this.setData('/publics/register/forgetPwd', {
			data
		});
	}
	/**
	 * @summary 未知接口，目前没有调用到
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/register/verifyCode]
	 * @todo    接口中心未查到
	 * @todo    目前没有调用到
	 * */
	registerVerifyCode(){
		return this.getData('/publics/register/verifyCode');
	}
	/**
	 * @summary 验证是否注册过
	 * @param   {String}    memberPhone
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/register/verifyPhone]
	 * @todo    接口中心未查到
	 * */
	registerVerifyPhone(memberPhone){
		return this.setData('/publics/register/verifyPhone', {
			data: {
				memberPhone
			}
		});
	}
	/**
	 * @summary 会员注册
	 * @param   {String}    phone
	 * @param   {String}    passwd
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/register/offlineRegister]
	 * @todo    接口中心未查到
	 * */
	offlineRegister(phone, passwd){
		return this.setData('/publics/register/offlineRegister', {
			data: {
				phone
				, passwd
			}
		});
	}
	/**
	 * @summary 对非用户基于领取优惠券注册
	 * @param   {String}        phone
	 * @param   {Number|String} couponId
	 * @param   {String}        sign
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/register/fastRegister]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3485}
	 * */
	fastRegister(phone, couponId, sign){
		return this.setData('/publics/register/fastRegister', {
			data: {
				phone
				, couponId
				, sign
			}
		});
	}

	/**
	 * @summary 返回域名拼装 url
	 * @param   {String}    path    路径，以 / 开头
	 * @return  {String}
	 * */
	returnUrl(path){
		return this._config.baseUrl + path;
	}

	/**
	 * @summary 快捷登录
	 * @param   {String}    cellPhone
	 * @param   {String}    password
	 * @param   {Number}    [sourceType=3]  注册来源，1.微信，2.订阅号，3.web，4.Android，5.iOS
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/fastLogin]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1727}
	 * */
	fastLogin(cellPhone, password, sourceType=3){
		return this.setData('/publics/fastLogin', {
			data: {
				cellPhone
				, password
				, sourceType
			}
		});
	}

	/**
	 * @summary 快捷登录发送短信验证码
	 * @param   {String}    cellPhone
	 * @param   {Number}    optType         业务类型，1.注册，2.快速登录，3.忘记密码，4.修改密码
	 * @param   {String}    regiCode        图形验证码
	 * @param   {Number}    smsVoiceType    验证码类型，1.语音，0.短信
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/authCode/send]{@link http://dev.51tiangou.com/interfaces/detail.html?id=1735}
	 * */
	authCode(cellPhone, optType, regiCode, smsVoiceType){
		return this.setData('/publics/authCode/send', {
			data: {
				cellPhone
				, optType
				, regiCode
				, smsVoiceType
			}
		});
	}

	/**
	 * @summary 实名认证相关 - 获取实名认证列表
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberIdentity/getMemberIdentityList]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3453}
	 * */
	identityList(){
		return this.getData('/publics/memberIdentity/getMemberIdentityList');
	}
	/**
	 * @summary 实名认证相关 - 通过 id 查询我的实名认证
	 * @param   {Number|String} id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberIdentity/getById]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3407}
	 * */
	identityGetById(id){
		return this.getData('/publics/memberIdentity/getById', {
			data: {
				id
			}
		});
	}
	/**
	 * @summary 实名认证相关 - 查询姓名查询我的实名认证
	 * @param   {String}    name
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberIdentity/getByName]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3451}
	 * */
	identityGetByName(name){
		return this.getData('/publics/memberIdentity/getByName', {
			data: {
				name
			}
		});
	}
	/**
	 * @summary 实名认证相关 - 新增实名认证
	 * @param   {String}    name
	 * @param   {String}    idCardNumber
	 * @param   {String}    idCardFront
	 * @param   {String}    idCardBack
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberIdentity/add]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3401}
	 * */
	identityAdd(name, idCardNumber, idCardFront, idCardBack){
		return this.setData('/publics/memberIdentity/add', {
			data: {
				name
				, idCardNumber
				, idCardFront
				, idCardBack
			}
		});
	}
	/**
	 * @summary 实名认证相关 - 更新实名认证
	 * @param   {Number|String} id
	 * @param   {String}        name
	 * @param   {String}        idCardNumber
	 * @param   {String}        idCardFront
	 * @param   {String}        idCardBack
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberIdentity/update]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3403}
	 * */
	identityUpdate(id, name, idCardNumber, idCardFront, idCardBack){
		return this.setData('/publics/memberIdentity/update', {
			data: {
				id
				, name
				, idCardNumber
				, idCardFront
				, idCardBack
			}
		});
	}
	/**
	 * @summary 实名认证相关 - 删除我的实名认证
	 * @param   {Number|String} id
	 * @return  {Promise}       返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberIdentity/delete]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3405}
	 * */
	identityDelete(id){
		return this.getData('/publics/memberIdentity/delete', {
			data: {
				id
			}
		});
	}
	/**
	 * @summary 实名认证相关 - 上传身份证图片
	 * @param   {FormData}  formData
	 * @param   {File}      formData.file
	 * @return  {Promise}   返回一个 Promise 对象，在 resolve 时传回返回结果
	 * @desc    使用 POST 方法
	 * @see     [http://mserv.test.66buy.com.cn/publics/memberIdentity/upload]{@link http://dev.51tiangou.com/interfaces/detail.html?id=3461}
	 * @deprecated          统一由 [img]{@link ImageServiceModel} 下 [syncImg]{@link ImageServiceModel#syncImg} 接口替代
	 * */
	identityUpload(formData){
		return this.setData('/publics/memberIdentity/upload', {
			data: formData
			, processData: false
			, contentType: false
		});
	}
}

Model.register('member', MemberServiceModel);

export default MemberServiceModel;