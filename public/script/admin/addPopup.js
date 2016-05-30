define(['jquery', 'global'], function($){
	var beforeSend
		, afterSend
		, $addPopup = $('#addPopup').on('click', '#addData', function(){
			var $form = $addPopup.find('form')
				, form = $form[0]
				, data = $form.serializeJSON()
				, rs
				;

			if( beforeSend ){
				rs = beforeSend( data );

				if( !rs ){
					return rs;
				}
			}

			$.ajax({
				url: form.action
				, type: form.method
				, data: data
				, success: function(json){
					if( json.msg === 'success' ){

						afterSend && afterSend(data, json);

						form.reset();
					}
				}
			});
		}).on('submit', 'form', function(e){
			e.preventDefault();

			$addData.trigger('click');
		})
		, $addData = $addPopup.find('#addData')
		;

	return function(before, after){
		beforeSend = before;
		afterSend = after;

		return $addPopup;
		//{
		//	addPopup:
		//	, show: function(){
		//		$addPopup.trigger('showDialog');
		//	}
		//	, close: function(){
		//		$addPopup.trigger('closeDialog');
		//	}
		//};
	}
});