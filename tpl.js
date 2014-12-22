/**
 * 模板管理
 */

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
	, filterData = function(fileObj){
		var tpl = fileObj.tpl
			;

		if( 'data' in fileObj ){

		}
	}
	;



exports.tpl = function(filePath){
	var rs = ''
		, type = typeof filePath
		, i
		, j
		, t
		;

	if( type === 'string' ){
		rs = readTpl( filePath );
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