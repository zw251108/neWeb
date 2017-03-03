import maple from 'maple';

// todo 减少使用 cookie

var global = maple.cookie('global')
	;

if( !global){

	if( navigator.userAgent.indexOf("AlipayClient") > 0 ){
		global = 'AlipayClient';
	}
	else if( maple.device.weixin ){
		global = 'wechat';
	}
	else{
		global = 'webapp';
	}

	maple.cookie('global', global);
}

export default global;