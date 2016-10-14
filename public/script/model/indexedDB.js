'use strict';

import Model from './model.js';

/**
 * @class   IndexedDBModel
 * */
class IndexedDBModel extends Model{
	/**
	 * @constructor
	 * */
	constructor(){
		super();
	}
}

Model.register('indexedDB', IndexedDBModel);

export default IndexedDBModel;