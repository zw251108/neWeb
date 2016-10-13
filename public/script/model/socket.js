'use strict';

import Model from './model';

class SocketModel extends Model{
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

Model.register('socket', SocketModel);

export default SocketModel;