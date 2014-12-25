/**
 * 模板管理
 * */
var fs = require('fs')
	, path = require('path')
	, TPL_CACHE = {}
	, TPL_DIR = 'tpl/'
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
	, handlerData = function(fileObj){
		var tpl = readTpl( fileObj.tpl )
			, data
			, i, j
			, t, k
			, temp
			, rs = ''
			;

		if( 'data' in fileObj ){
			data = fileObj.data;
			temp = tpl;

			if( Array.isArray( data ) ){
				for( i = 0, j = data.length; i < j; i++ ){
					t = data[i];
					for( k in t ) if( t.hasOwnProperty( k ) ){
						temp = temp.replace('%'+ k +'%', t[k]);
					}
					rs += temp;
					temp = tpl;
				}
			}
			else{
				t = data;
				for( k in t ) if( t.hasOwnProperty( k ) ){
					temp = temp.replace('%'+ k +'%', t[k]);
				}
				rs += temp;
			}
		}
		else{
			rs = tpl;
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

		for(i = 0, j = filePath.length; i < j; i++){
			t = filePath[i];
			type = typeof t;

			if( type === 'string' ){
				rs += readTpl( t );
			}
			else if( type === 'object' ){

			}
		}
	}

	return rs;
};