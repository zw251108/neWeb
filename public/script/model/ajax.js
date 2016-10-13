'use strict';

import Model from './model.js';

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