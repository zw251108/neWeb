/**
 * @module msg.popup
 * */
define(['jquery', 'global'], function($, g){
	var $msgPopup = $('msgPopup')
		;

	$msgPopup.showMsg = function(msg){
		$msgPopup.find('#msgContent').html( msg).end().trigger('showDialog');
	};

	return $msgPopup
});