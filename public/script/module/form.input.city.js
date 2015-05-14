/**
 * @module form.input.city 表单增强：城市选择控件
 *
 dialog#inputCity[open=open]
 dialog form[method=dialog]
 dialog form :submit.input_close[value=0]
 dialog form ul#cityList

 // 动态生成
 dialog form ul li
 dialog form ul label>:checkbox
 * */
define(['jquery'], function($){
	var $inputCity = $('#inputCity')
		, origin = 'returnValue' in $inputCity[0]   // 是否支持原生接口
		;

	// 获取数据
	$.ajax({
		url: '../../../UED/matchup/data/hrcenter/arealist1.json'
		, dataType: 'json'
		, success: function(data){
			$inputCity.find('#cityList').append( $.map(data, function(d){
				return '<li>'+ d.name + '<ul class="hidden">' +
					$.map(d.children, function(d){
						return '<li><label><input type="radio" name="city" value="'+ d.id +'"/><span>'+ d.name +'</span></label></li>'
					}).join('') + '</ul></li>';
			}).join('') ).data('dataList', data);
		}
	});

	if( origin ){
		$inputCity.removeAttr('open').removeClass('hidden');
	}

	$inputCity.on({
		show: function(){   // 显示弹窗
			origin ? $inputCity[0].show() : $inputCity.removeClass('hidden');
		}
		, hide: function(){    // 关闭弹窗
			var rs = this.returnValue || $inputCity.data('returnValue')
				, $idTarget
				, $valTarget
				, $checked
				;
			if( origin ){
				$inputCity.prop('open') && $inputCity[0].close();
			}
			else{
				!$inputCity.hasClass('hidden') && $inputCity.addClass('hidden');
			}

			if( rs !== '0' ){  // 非点击关闭
				$idTarget = $inputCity.data('idTarget');
				$valTarget = $inputCity.data('valTarget');

				$checked = $inputCity.find(':checked');

				if( $inputCity.data('multi') > 1 ){
					$idTarget.val( $checked.map(function(){
						return this.value;
					}).get().join() );

					$valTarget.val( $checked.map(function(){
						return $(this).parent().text();
					}).get().join() );
				}
				else{
					$idTarget.val( $checked.val() );
					$valTarget.val( $checked.parent().text() );
				}
			}
		}
	}).on('click', '.dialog_close', function(){ // 关闭事件
		!origin && $inputCity.data('returnValue', '0').triggerHandler('hide');
	}).on('click', 'li', function(){
		var $list = $(this).find('ul');

		!$list.find(':checked').length && $list.slideToggle();
	}).on('click', 'label', function(e){
		e.stopImmediatePropagation();
		$inputCity.triggerHandler('hide');
	});

	$(document).on('focus', '[data-input="city"]', function(){
		var $that = $(this)
			, idTarget = $that.data('inputId')
			, valTarget = $that.data('inputVal')
			, multi = $that.data('multi') || 1
			;

		valTarget = valTarget ? $(valTarget) : $that;
		idTarget = idTarget ? $(idTarget) : $that.next();

		$inputCity.triggerHandler('show');

		// 设置是否多选
		$inputCity.data('multi', +multi);

		// 绑定输出 目标
		$inputCity.data('valTarget', valTarget);
		$inputCity.data('idTarget', idTarget);
	});

	return $inputCity;
});