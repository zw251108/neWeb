import Model from './model.js';
import Cookie from './cookie.js';
import LocalStorage from './localStorage.js';
import SessionStorage from './sessionStorage.js';

const MODEL_CACHE = {};

function modelFactory(type, noCache){
	let model
		;

	if( type in MODEL_CACHE && !noCache ){
		model = MODEL_CACHE[type];
	}
	else{
		switch( type ){
			case 'cookie':
				model = new Cookie();
				break;
			case 'localStorage':
				model = new LocalStorage();
				break;
			case 'sessionStorage':
				model = new SessionStorage();
				break;
			default:
				model = new Model();
				break;
		}

		if( !noCache ){
			MODEL_CACHE[type] = model;
		}
	}

	return model;
}

export default modelFactory;