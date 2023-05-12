const DATABASE_ERROR = 1    // 数据库错误
	, MISS_PARAM = 2        // 缺少参数
	, NO_DATA = 3           // 资源不可用
	, AUTH_FAIL = 4         // 授权失败
	, ERROR_CODE = {
		[DATABASE_ERROR]: {
			log: '数据获取失败'
			, send: '后台出错了'
		}
		, [MISS_PARAM]: {
			log: '缺少参数'
		}
		, [NO_DATA]: {
			log: '数据不存在'
		}
		, [AUTH_FAIL]: {
			log: '授权失败'
		}
	}
	;

function errorHandler(code){
	if( !(code in ERROR_CODE) ){
		console.log('错误：', code);

		return {
			code
			, msg: '未知错误'
		};
	}

	console.log( ERROR_CODE[code].log );

	return {
		code
		, msg: ERROR_CODE[code].send || ERROR_CODE[code].log
	};
}

export default errorHandler;

export {
	DATABASE_ERROR
	, MISS_PARAM
	, NO_DATA
	, AUTH_FAIL
};