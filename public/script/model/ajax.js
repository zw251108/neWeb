'use strict';

import Model from './model.js';

// todo 有 fetch 优先使用 fetch

class AjaxModel extends Model{
	constructor(){
		super();
	}
	setData(key, value){

	}
	getData(key){

	}
	clearData(){

	}
}

Model.register('ajax', AjaxModel);

export default AjaxModel;