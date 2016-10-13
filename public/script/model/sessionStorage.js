'use strict';

import Model from './model.js';

class SessionStorageModel extends Model{
	constructor(){
		super();
	}
}

Model.register('sessionStorage', SessionStorageModel);

export default SessionStorageModel;