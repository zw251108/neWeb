import maple from 'cyan-maple';

maple.setDefaultDI();
maple.useAxios();

window.maple = maple;

const CONFIG = {
		prefix: ''
	}
	;

function prefix(title){
	return CONFIG.prefix ? `${CONFIG.prefix}-${title}` : title;
}

export default CONFIG;

export {
	prefix
};