'use strict';

import Model from './model.js';

class IndexedDBModel extends Model{
	constructor(){
		super();
	}
}

Model.register('indexedDB', IndexedDBModel);

export default IndexedDBModel;