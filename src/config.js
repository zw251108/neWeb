import maple from 'cyan-maple';

maple.setDefaultDI();
maple.useAxios();

window.maple = maple;

const CONFIG = {
		prefix: ''
		, imgRoot: '//zw150026.com'
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
};