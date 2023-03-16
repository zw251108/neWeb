import maple from 'cyan-maple';

maple.setDefaultDI();
maple.useAxios();

window.maple = maple;

let baseUrl
	, imgRoot
	;

if( process.env.NODE_ENV === 'production' ){
	baseUrl = '//zw150026.com';
	imgRoot = '//zw150026.com';
	maple.setDebug( false );
}
else{
	baseUrl = '//localhost:9001';
	imgRoot = '//localhost:9001';
}

const CONFIG = {
		prefix: ''
		, baseUrl
		, imgRoot
	}
	;

function prefix(title){
	return CONFIG.prefix ? `${CONFIG.prefix}-${title}` : title;
}

function imgPath(path){
	return `${CONFIG.imgRoot}${path}`;
}

export default CONFIG;

export {
	prefix
	, imgPath
	, baseUrl
};