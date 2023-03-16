'use strict';

const INJECT_FUNC_LIST = [
		'$urlParams'
		, '$hashParams'
	]
	, INJECT_CONST_LIST = [
		'$cookie'
		, '$ls'
		, '$ss'
	]
	, INJECT_DATE = /^\$date/
	, INJECT_DATE_HANDLER = function(dateFormat, inject){
		let args = /\((.*)\)/.exec( inject )
			, delay = 0
			;

		if( args ){
			args = args[1].split(',');
		}
		else{
			args = [];
		}

		if( args[0] ){
			delay = dateFormat.formatTimeStr( args[0] );
		}

		return dateFormat(new Date( Date.now() + delay ), args[1]);
	}
	;

// 处理注入参数
function handleInjectParams(value){
	if( typeof value !== 'string' ){
		return value;
	}

	let [ inject, key ] = value.split('.')
		;

	if( INJECT_FUNC_LIST.includes(inject) ){
		return this[inject]()[key];
	}
	else if( INJECT_CONST_LIST.includes(inject) ){
		return this[inject].sync.getData( key );
	}
	else if( INJECT_DATE.test(inject) ){
		return INJECT_DATE_HANDLER(this.$util.dateFormat, inject);
	}

	return value;
}

export default {
	methods: {
		// 处理注入参数
		handleInjectParams
	}
};

export {
	handleInjectParams
};