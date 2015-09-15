/**
 * @module msg.popup
 * */
define(['jquery', 'global'], function($, g){
	var msgPopup = {}
		;

	msgPopup.$target = $('#msgPopup');
	msgPopup.showMsg = function(msg){
		this.$target.find('#msgContent').html( msg ).end().trigger('showDialog');
	};

	return msgPopup
});