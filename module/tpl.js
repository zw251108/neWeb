/**
 * 模板管理
 * */
var fs = require('fs')
	, path = require('path')
	, TPL_CACHE = {}
	, TPL_DIR = 'tpl/'
	, TPL_KEY = '%'
	, readTpl = function(filePath){
		var rs = '';
		if( filePath in TPL_CACHE ){
			rs = TPL_CACHE[filePath];
		}
		else{
			try{
				rs = fs.readFileSync( TPL_DIR + filePath +'.html').toString();
				TPL_CACHE[filePath] = rs;
				console.log('read file ', TPL_DIR + filePath +'.html' );
			}
			catch(e){
				console.log(e);
			}
		}

		return rs;
	}
	, handlerData = function(filePath){
		var data
			, type
			, i, j
			, m, n
			, k
			, t, temp, tpl
			, rs = ''
			;

		for(i = 0, j = filePath.length; i < j; i++){
			t = filePath[i];
			type = typeof t;

			if( type === 'string' ){
				rs += readTpl( t );
			}
			else if( type === 'object' ){

				tpl = readTpl( filePath.tpl );
				temp = tpl;

				if( 'data' in t ){
					data = filePath.data;

					if( typeof data === 'object' && !Array.isArray( data ) ){
						data = [data];
					}

					for( m = 0, n = data.length; m < n; m++ ){
						t = data[m];

						for( k in t ) if( t.hasOwnProperty( k ) ){
							temp = temp.replace(TPL_KEY + k + TPL_KEY, t[k]);
						}

						rs += temp;
						temp = tpl;
					}

					for( k in filePath ) if( filePath.hasOwnProperty(k) && k !== 'tpl' && k !== 'data' ){

					}
					//else{
					//	t = data;
					//	for( k in t ) if( t.hasOwnProperty( k ) ){
					//		temp = temp.replace('%'+ k +'%', t[k]);
					//	}
					//	rs += temp;
					//}
				}
			}
		}

		return rs;
	}
	;



exports.tpl = function(filePath){
	var rs = ''
		, type = typeof filePath
		, i, j, t
		;

	if( type === 'string' ){
		rs += readTpl( filePath );
	}
	else if( type === 'object' && Array.isArray( filePath ) ){

		rs = handlerData( filePath );
	}

	return rs;
};