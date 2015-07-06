/**
 * @file    基于 jQuery 的 validator 插件
 * @author  ZwB
 * @version 1.0
 * @module  validator
 * @require jquery
 * @method  $.validator
 * @desc
 *  <pre>
 *  validType       验证类型 对象集合 每一个属性都是一种验证类别 每一个属性对应一个对象
        该对象中的属性名 对应着执行验证的方法 值为提示信息

 *  validMethods    验证方法 对象集合 每一个方法都是使用 apply 方式被调用，方法中的 this 是进行验证的 jQuery 对象
 *  </pre>
 * @param   {object}    options
 * @param   {(string|object)}   options.selector    需要验证的表单对象
 * @param   {function(string)}  options.normal  重置表单时的操作
 * @param   {function(string)}  options.focus   表单项获得焦点时的操作
 * @param   {function(string)}  options.wrong   表单项未通过验证时的操作
 * @param   {function(string)}  options.right   表单项通过验证时的操作
 * @return  {object}    参数 selector 所对应的 jQuery 对象
 * @example
 *  JavaScript 代码：
    $(function(){
        $.validator.validType.username = {// 用户名 验证配置
            type: ['required', '请填写用户名'],
            trim: true, // 验证时对值进行 trim
            focus: '请输入6~12位数字、字母、下划线组合，并以字母开头', // 获得焦点时的操作
            valid:[
                ['regexp', /^[a-z]/i],
                ['regexp', /^[a-z0-9_]$/i],
                ['length', 6, 20],
                ['ajax', 'url', '']
            ],
            text:['只能字母开头', '只能输入数字、字母、下划线组合', '只能输入6~12位字符', '该用户名已被注册，请尝试其他用户名'],
            right:'',
            callback:function(rs){alert(rs?'通过验证':'未通过验证')} // 验证后的回调函数
        };
        var $userNameForm = $.validator({
            selector: '#userNameForm',
            normal:function(txt){
                this.next().empty();
            },
            focus:function(txt){
                this.next().html( txt );
            },
            wrong:function(txt){
                alert(txt);
            },
            right:function(txt){
                alert('通过验证');
            }
        });
    })
 *  HTML 代码：
	<form id="userNameForm" action="">
		<input type="text" name="username" id="username" data-validator="username" /><span></span>
	</form>
 * @todo    重构
 * @todo    submit 事件可以不触发
 */
;(function(factory, jqPath){
	if( typeof exports === 'object' && typeof module === 'object' ){
		factory( require(jqPath || 'jquery') );
	}
	else if( typeof define === 'function' && define.amd ){
		define([jqPath || 'jquery'], factory);
	}
	else{
		factory(jQuery);
	}
})(function($){
	'use strict';

	var methods = {
			valid: function(){
				var $items = this.formItems
					, i = $items.length
					, validType = $.validator.validType
					, $item
					, type
					, result = true
					;

				while( i-- ){
					$item = $items.eq(i);
					type = $item.data('validator');

					if( typeof type === 'string' ){
						type = validType[type] || {};

						$item.data('validator', type);
					}

					result = this.triggerHandler('valid', [$item, type]) && result;
				}

				return result;
			}
			, reset: function(){ // 重置表单
				var $items = this.formItems
					, i = $items.length
					, normal = this.validOpts.normal
					;

				this.get(0).reset();    // 重置表单项的值

				while( i-- ){
					normal.apply( $items.eq(i) );
				}
			}
			, result: function(){    // 返回表单数据
				var array = this.serializeArray()
					, data = {}
					, temp
					, i = array.length
					;

				while( i-- ){
					temp = array[i];

					if( temp.name in data ){
						data[temp.name] += ','+ temp.value;
					}
					else{
						data[temp.name] = temp.value;
					}
				}

				return data;
			}
		}
		, log = function( msg ){
			console && console.log && console.log( msg );
		}
		;

	var Validator = function( options ){
		var opts = $.extend({}, Validator.defaults, options)
			, $form = opts.selector
			, validType = Validator.validType
			, validMethods = Validator.validMethods
			, validEvent = Validator.validEvent
			, validTrigger = function(){
				var $self = $form.formItems.filter(this)
					, type = $self.data('validator')
					;

				if( typeof type === 'string' ){

					type = validType[type] || {};

					$self.data('validator', type);
				}

				$form.triggerHandler('valid', [$self, type]);
			}
			, k
			;

		$form = (typeof $form === 'object' && $form.jQuery) ? $form : $($form);

		$form.on({
			'submit::validator': function(e){

				var rs = $form.valid();

				if( !rs ){
					e.stopImmediatePropagation();
				}

				return rs;
			}
			, valid: function(e, $item, type){

				var methods = type.valid || []
					, i = 0
					, j = methods.length

					, validTemp
					, validName
					, validText

					, result = true
					, isValid = true
					, isRequired = false

					, required = validMethods.required

					, wrong = opts.wrong
					;

				if( 'trim' in type ){

					$item.val(function(){
						return $.trim( this.value );
					});
				}

				if( 'type' in type ){ // 验证类型

					isRequired = true;
					validTemp = type.type.slice(0);
					validName = validTemp.shift();
					validText = validTemp.pop();

					// 判断当前值是否为空
					isValid = required.call($item);

					if( validName === 'required' ){ // 必填验证 已经验证
					}
					else if( validName === 'or' ){ // 多选一验证
						if( !isValid ){
							isValid = false;
							isRequired = !validMethods.or.apply($item, validTemp);
						}
					}
					else if( validName === 'and' ){ // 多项同时填写
						isValid = isValid && validMethods.and.apply($item, validTemp);
						isRequired = false;
					}
					else{   // 自定义
						isValid = validMethods[validName].apply($item);
					}
					result = isValid;
				}
				else{ // 未设置 为选填
					isValid = required.call($item);
				}

				if( isValid ){ // 继续验证
					for(; i < j; i++){
						validTemp = methods[i].slice();
						validName = validTemp.shift();
						result = validMethods[validName].apply($item, validTemp) && result;

						if( !result ){
							wrong.call($item, type.text[i] || type.text[0]);
							break;
						}
					}
				}
				else{
					if( isRequired ){
						wrong.call($item, validText);
						result = false;
					}
					else{
						opts.normal.call($item);
						result = true;
					}
				}

				if( result ){ // 通过验证
					if( 'right' in type && isValid ){
						opts.right.call($item, type.right);
					}
					else{
						opts.normal.call($item);
					}
				}

				if( 'callback' in type ){
					type.callback.call($item, result);
				}

				return result;
			}
		}).on('focus:validator', '[data-validator]', function(){

			var $self = $form.formItems.filter(this)
				, type = $self.data('validator')
				;

			if( typeof type === 'string' ){
				type = validType[type] || {};

				$self.data('validator', type);
			}

			if( ('focus' in type) && ('focus' in opts) ){
				opts.focus.call($self, type.focus);
			}
		});

		for( k in validEvent ) if( validEvent.hasOwnProperty(k) ){
			$form.on(validEvent[k] +':validator', k +'[data-validator]', validTrigger);
		}

		$form.validOpts = opts;
		$form.formItems = $($form[0].item).filter('[data-validator]');
		$.extend($form, methods);

		return $form;
	};
	Validator.defaults = {
		selector:''
		, focus:null
		, wrong:null
		, right:null
		, normal:null
	};
	Validator.validType = {};
	Validator.validEvent = {
		':text': 'blur'
		, ':password': 'blur'
		, ':radio': 'click'
		, ':checkbox': 'click'
		, 'select': 'change'
	};
	Validator.validMethods = {
		/**
		 *  必填项验证
		 * */
		/**
		 * @return  {boolean}   验证结果
		 * @desc    验证是否为空
		 * */
		required: function(){
		    var result = false;

			if( this.is(':radio,:checkbox') ){
				result = ( this.parents('form').find('input[name="'+ this.attr('name') +'"][data-validator]:checked').length > 0 );
			}
			else{
				result = !!this.val();
			}

			return result;
		}
		/**
		 * @param   {string=}   selector   参数至少 1 个 为 jquery 选择器
		 * @return  {boolean}   验证结果
		 * @desc    检测当前标签与目标标签至少一个不为空，参数至少 1 个 为 jquery 选择器
		 * */
		, or: function(selector){
			var required = Validator.validMethods.required
				, result = required.apply( this )
				, argc = arguments.length
				, i = 0
				;

			if( argc < 1 ){
				log("参数设置错误");
				result = false;
			}
			else{
				for(; i < argc; i++){
					if( result ) break;
					result =  result || required.apply( $(arguments[i]) );
				}
			}

			return result;
		}
		/**
		 * @param   {string=}   selector    参数至少 1 个 为 jquery 选择器
		 * @return  {boolean}   验证结果
		 * @desc    检测当前标签与目标标签同时不为空，参数至少 1 个 为 jquery 选择器
		 * */
		, and: function(selector){
			//

			var required = Validator.validMethods.required
				, result = required.apply( this )
				, argc = arguments.length
				, i = 0
				;

			if( argc < 1 ){
				log("参数设置错误");
				result = false;
			}
			else{
				for(; i < argc; i++){
					if( !result ) break;
					result = result && required.apply( $(arguments[i]) );
				}
			}

			return result;
		}
		/**
		 *  特殊标签验证
		 * */
		/**
		 * @param   {number}    min 最小选择个数
		 * @param   {number=}   max 最大选择个数（可选）
		 * @return  {boolean}   验证结果
		 * @desc    检测设置了 multiple 属性的 select 标签的可选个数，至少 1 个参数，参数 1 为最小选择个数，参数 2 为最大选择个数（可选），其余参数忽略
		 * */
		, select: function(min, max){
			var result = false
				, argc
				, numSelect
				;

			if( this.is('select') && this.attr('multiple') === 'multiple' ){
				// 是 select 标签并且 select 标签设置了 multiple 属性

				argc = arguments.length;
				numSelect = this.find(':selected').length;

				if( argc === 1 ){
					result = ( numSelect >= min );
				}
				else if( argc > 1 ){
					result = ( numSelect >= min && numSelect <= max );
				}
				else{
					log('参数设置错误');
				}
			}
			else{
				// 不是 select 标签或 select 标签没有 multiple 属性
				log("标签设置错误");
			}

			return result;
		}
		/**
		 * @param   {number}    min 最小选择个数
		 * @param   {number=}   max 最大选择个数（可选）
		 * @return  {boolean}   验证结果
		 * @desc    检测 checkbox 的可选个数，至少 1 个参数，参数 1 为最小选择个数，参数 2 为最大选择个数（可选），其余参数忽略
		 * */
		, checkbox: function(min, max){
			var result = false
				, argc
				, numChecked
				;

			if( !this.is(':checkbox') ){
				log("标签错误");
			}
			else{
				argc = arguments.length;
				numChecked = this.parents('form').find('input[name="'+ this.attr('name') +'"][data-validator]:checkbox:checked').length;

				if( argc === 1 ){
					result = ( numChecked >= min );
				}
				else if( argc > 1 ){
					result = ( numChecked >= min && numChecked <= max );
				}
				else{
					log('参数设置错误');
				}
			}

			return result;
		}
		/**
		 *  字符串类型验证
		 * */
		/**
		 * @param   {number}    min 最小选择个数
		 * @param   {number=}   max 最大选择个数（可选）
		 * @return  {boolean}   验证结果
		 * @desc    检测字符串长度，至少 1 个参数，参数 1 为最小长度，参数 2 为最大长度（可选），其余参数忽略
		 * */
		, length: function(min, max){
			var result = false
				, argc = arguments.length
				, length = this.val().length
				;

			if( argc === 1 ){
				result = ( length >= min );
			}
			else if( argc > 1 ){
				result = ( length >= min && length <= max );
			}
			else{
				log('未知异常');
			}

			return result;
		}
		/**
		 * @param   {regexp=}   regexp
		 * @return  {boolean}   验证结果
		 * @desc    检测是否非法字符，reg 为正则表达式规则 默认值为 /^[a-z0-9_]*$/i
		 * */
		, regexp: function( regexp ){
			return (regexp || /^[a-z0-9_]*$/i).test( this.val() );
		}
		/**
		 *  比较类型验证
		 * */
		/**
		 * @param   {*} value   一个固定数据
		 * @return  {boolean}   验证结果
		 * @desc    检测与目标 value 是否相等，参数 value 为一个固定数据
		 * */
		, equal: function(value){
			var result = false;

			if( value ){
				result = ( this.val() === value );
			}
			else{
				log('参数设置错误');
			}

			return  result;
		}
		/**
		 * @param    {*} value   一个固定数据
		 * @return  {boolean}   验证结果
		 * @desc    检测与目标 value 是否不相等，参数 value 为一个固定数据
		 * */
		, unequal: function(value){
			var result = false;

			if( value ){
				result = ( this.val() !== value );
			}
			else{
				log('参数设置错误');
			}

			return result;
		}
		/**
		 * @param   {*} value   一个固定数据
		 * @param   {boolean}    equal   是否可以等于 value
		 * @return  {boolean}   验证结果
		 * @desc    检测是否小于目标 value，参数 value 为一个固定数据，equal 是否可以等于 value
		 * */
		, lt: function(value, equal){
			var result = false;

			if( value ){
				result = equal ? ( this.val() <= value ) : ( this.val() < value );
			}
			else{
				log('参数设置错误');
			}

			return result;
		}
		/**
		 * @param   {*} value   一个固定数据
		 * @param   {boolean}    equal   是否可以等于 value
		 * @return  {boolean}   验证结果
		 * @desc    检测是否大于目标 value，参数 value 为一个固定数据，equal 是否可以等于 value
		 * */
		, gt: function(value, equal){
			var result = false;

			if( value ){
				result = equal ? ( this.val() >= value ) : ( this.val() > value );
			}
			else{
				log('参数设置错误');
			}

			return result;
		}

		/**
		 *  DOM 对象属性值比较类型验证
		 * */
		/**
		 * @param   {string}    selector    为 jquery 选择器，若只有一个参数则默认从 val 取值
		 * @param   {string=}   method  为 jquery 方法名（attr,data,html,prop,text,val）
		 * @param   {string=}   name    为属性名
		 * @return  {boolean}   验证结果
		 * @desc    检测与目标 dom 对象的属性值是否相等，至少一个参数，参数 selector 为 jquery 选择器，method 为 jquery 方法名（attr,data,prop,text,html），name 为属性名，若只有一个参数则默认从 val 取值
		 * */
		, equalDOMProp: function(selector, method, name){
			var argc = arguments.length
				, result = false
				;
			if( argc === 1 ){
				result = ( this.val() === $(selector).val() );
			}
			else if( argc > 1 ){

				switch( method ){
					case 'html':
					case 'text':
					case 'val':
						result = ( this.val() === $(selector)[method]() );
						break;
					case 'attr':
					case 'data':
					case 'prop':
						if( name ){
							result = ( this.val() === $(selector)[method]( name ) );
						}
						else{
							log('参数设置错误');
						}
						break;
					default:
						log('参数设置错误');
						break;
				}
			}
			else{
				log('参数设置错误');
			}
			return result;
		}
		/**
		 * @param   {string}    selector    为 jquery 选择器，若只有一个参数则默认从 val 取值
		 * @param   {string=}   method  为 jquery 方法名（attr,data,html,prop,text,val）
		 * @param   {string=}   name    为属性名
		 * @return  {boolean}   验证结果
		 * @desc    检测与目标 dom 对象的属性值是否不相等，至少一个参数，参数 selector 为 jquery 选择器，method 为 jquery 方法名（attr,data,prop,text,html），name 为属性名，若只有一个参数则默认从 val 取值
		 * */
		, unequalDOMProp: function(selector, method, name){
			// 检测与目标 dom 对象的属性值是否不相等，至少一个参数，参数 selector 为 jquery 选择器，method 为 jquery 方法名（attr,data,prop,text,html），name 为属性名，若只有一个参数则默认从 val 取值

			var argc = arguments.length
				, result = false
				;
			if( argc === 1 ){
				result = ( this.val() !== $(selector).val() );
			}
			else if( argc > 1 ){

				switch( method ){
					case 'html':
					case 'text':
					case 'val':
						result = ( this.val() !== $(selector)[method]() );
						break;
					case 'attr':
					case 'data':
					case 'prop':
						if( name ){
							result = ( this.val() !== $(selector)[method]( name ) );
						}
						else{
							log('参数设置错误');
						}
						break;
					default:
						log('参数设置错误');
						break;
				}
			}
			else{
				log('参数设置错误');
			}
			return result;
		}
		/**
		 * @param   {string}    selector    为 jquery 选择器，若只有一个参数则默认从 val 取值
		 * @param   {boolean}   equal   是否可以与目标值相等
		 * @param   {string=}   method  为 jquery 方法名（attr,data,html,prop,text,val）
		 * @param   {string=}   name    为属性名
		 * @return  {boolean}   验证结果
		 * @desc    检测是否小于等于目标 dom 对象的属性值，至少一个参数，参数 selector 为 jquery 选择器，method 为 jquery 方法名（attr,data,prop,text,html），name 为属性名，若只有一个参数则默认从 val 取值
		 * */
		, ltDOMProp: function(selector, equal, method, name){
			// 检测是否小于目标 dom 对象的属性值，至少一个参数，参数 selector 为 jquery 选择器，method 为 jquery 方法名（attr,data,prop,text,html），name 为属性名，若只有一个参数则默认从 val 取值

			var argc = arguments.length
				, result = false
				;
			if( argc === 1 ){
				result = ( this.val() < $(selector).val() );
			}
			else if( argc > 1 ){

				switch( method ){
					case 'html':
					case 'text':
					case 'val':
						result = ( this.val() < $(selector)[method]() );
						break;
					case 'attr':
					case 'data':
					case 'prop':
						if( name ){
							result = ( this.val() < $(selector)[method]( name ) );
						}
						else{
							log('参数设置错误');
						}
						break;
					default:
						log('参数设置错误');
						break;
				}
			}
			else{
				log('参数设置错误');
			}
			return result;
		}
		/**
		 * @param   {string}    selector    为 jquery 选择器，若只有一个参数则默认从 val 取值
		 * @param   {boolean}   equal   是否可以与目标值相等
		 * @param   {string=}   method  为 jquery 方法名（attr,data,html,prop,text,val）
		 * @param   {string=}   name    为属性名
		 * @return  {boolean}   验证结果
		 * @desc    检测是否大于等于目标 dom 对象的属性值，至少一个参数，参数 selector 为 jquery 选择器，method 为 jquery 方法名（attr,data,prop,text,html），name 为属性名，若只有一个参数则默认从 val 取值
		 * */
		, gtDOMProp: function(selector, equal, method, name){
			var argc = arguments.length
				, result = false
				;
			if( argc === 1 ){
				result = ( this.val() > $(selector).val() );
			}
			else if( argc === 2 ){
				result = ( this.val() >= $(selector).val() );
			}
			else if( argc > 2 ){

				switch( method ){
					case 'html':
					case 'text':
					case 'val':
						result = equal ? ( this.val() >= $(selector)[method]() ) : ( this.val() > $(selector)[method]() );
						break;
					case 'attr':
					case 'data':
					case 'prop':
						if( name ){
							result = equal ? ( this.val() >= $(selector)[method]( name ) ) : ( this.val() > $(selector)[method]( name ) );
						}
						else{
							log('参数设置错误');
						}
						break;
					default:
						log('参数设置错误');
						break;
				}
			}
			else{
				log('参数设置错误');
			}
			return result;
		}
		/**
		 *  数字类型验证
		 * */
		/**
		 * @desc    检测是否为数字 包括负数和小数的情况
		 * */
		, isNumber: function(){
			return /^-?\d+\.?\d*$/.test( this.val() );
		}
		/**
		 * @param   {number}    min 最小值
		 * @param   {number=}   max 最大值（可选）
		 * @return  {boolean}   验证结果
		 * @desc    检测数值大小，至少 1 个参数，参数 1 为最小值，参数 2 为最大值（可选），其余参数忽略
		 * */
		, limit: function(min, max){
			var result = false
				, argc = arguments.length
				, value = Number( this.val() )
				;

			if(argc === 1){
				result = ( value >= min );
			}
			else if(argc > 1){
				result = ( value >= min && value <= max );
			}
			else {
				log('参数设置错误');
			}

			return result;
		}
		/**
		 * @param   {number}    digit   小数点右侧的最大位数
		 * @param   {number=}   size    数字的最大位数（可选）
		 * @return  {boolean}   验证结果
		 * @desc    检测浮点型数值，至少 1 个参数，参数 1 为小数点右侧的最大位数，参数 2 为数字的最大位数（可选），其余参数忽略
		 * */
		, decimal: function(digit, size){
			var result = false
				, argc = arguments.length
				, regexp
				, temp
				;

			if( argc === 1 ){
				regexp = new RegExp('^-?\\d+\\.?\\d{0,'+ digit +'}$');
				result = regexp.test( this.val() );
			}
			else if( argc > 1 ){
				temp = size - digit;
				regexp = new RegExp('^-?\\d'+ (temp >= 1 ? '{1'+ (temp === 1 ? '' : ','+ temp) +'}' : '+') +'\\.?\\d{0,'+ digit +'}$');
				result = regexp.test( this.val() );
			}
			else{
				log('参数设置错误');
			}

			return result;
		}
		/**
		 * @return  {boolean}   验证结果
		 * @desc    检测指数数值
		 * */
		, exponent: function(){
			return /^-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?$/i.test( this.val() );
		}
		/**
		 *  ajax 验证
		 *  todo 改成 异步
		 * */
		/**
		 * @param   {string}    url 服务器链接路径
		 * @param   {*} expected    对服务器返回结果的期望值
		 * @param   {string}    type    发送 ajax 的类型
		 * @param   {string|object} param   发送 ajax 时附带的额外参数
		 * @return  {boolean}   验证结果
		 * @desc    ajax 将值发送到服务器端进行验证，方法为同步
		 * @todo    改成异步
		 * @todo    可执行 jsonp
		 * */
		, ajax: function(url, expected, type, param){
			var self = this
				, value = self.val()
				, name = self.attr('name')
				;

			if( param ){
				if( typeof param === 'string' ){
					param += '&' + name + '=' + value;
				}
				else if( typeof param === 'object' ){
					param[name] = value;
				}
			}
			else{
				param = name + '=' + value;
			}

			return expected === $.ajax({
				url: url
				, type: (type ? type : 'GET')
				, data: param
				, async: false
			}).responseText;
		}
		/**
		 *  特殊验证类型
		 * */
		/**
		 * @param   {regexp=}   regexp  自定义验证正则表达式
		 * @return  {boolean}   验证结果
		 * @desc    检验是否为合法 url，可以自定义验证正则表达式
		 * */
		, url: function( regexp ){
			return (regexp || /^(?:http(?:s?):\/\/)?[a-z0-9\u4E00-\u9FA5\-_\.]*[a-z0-9\-_\u4E00-\u9FA5]+(?::(\d+))?\.[a-z0-9\u4E00-\u9FA5]+[0-9a-z\$\-\._'\(\)\/!\?#&\+=%\u4E00-\u9FA5]*/i).test( this.val() );
		}
		/**
		 * @param   {regexp=}   regexp  自定义验证正则表达式
		 * @return  {boolean}   验证结果
		 * @desc    检验是否为合法邮箱，可以自定义验证正则表达式
		 * */
		, email: function( regexp ){
			return (regexp || /^(?:[a-z0-9_\-\.'])+@(?:[a-z0-9_\-\.])+\.(?:[a-z]{2,6})$/i).test( this.val() );
		}
		/**
		 * @return  {boolean}   验证结果
		 * @desc    检测是否为中文，正则表达式为 /^[\u4E00-\u9FA5]*$/
		 * */
		, isChinese: function(){
			return /^[\u4E00-\u9FA5]*$/.test( this.val() );
		}
		/**
		 * @param   {regexp=}   regexp  自定义验证正则表达式
		 * @return  {boolean}   验证结果
		 * @desc    检测是否为合法身份证号码，可以自定义验证正则表达式
		 * */
		, idNumber: function( regexp ){
			return (regexp || /^\d{6}(?:((?:19|20)\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[0-1])\d{3}(?:x|X|\d)|(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[0-1])\d{3}))$/).test( this.val() );
		}
		/**
		 * @param   {string|string[]}   type    验证文件类型，字符串格式为逗号分隔，或为文件类型的数组
		 * @param   {string|number} size    文件大小
		 * @return  {boolean}   验证结果
		 * @desc    检测上传文件是否为合法的文件类型（未完成）
		 * @todo    待完成
		 * */
		, file: function(type, size){
			var result = false;

			if( type ){

			}
			else{
				log('参数设置错误');
			}

			return result;
		}
		/**
		 * @return  {boolean}   验证结果
		 * @desc    验证是否为电话号码
		 * @todo    待完成
		 * */
		, tel: function(){
			var result = false;

			// todo 验证电话号码

			return result;
		}
		/**
		 * @return  {boolean}   验证结果
		 * @desc    验证是否为手机号码
		 * @todo    待完成
		 * */
		, phone: function(){
			var result = false;

			// todo 验证手机号码

			return result;
		}
	};

	$.validator = Validator;

	return Validator;
}, '');