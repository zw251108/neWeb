'use strict';

import Model from './model.js';

class WebSQLModel extends Model{
	constructor(){
		super();
	}
}

Model.register('webSQL', WebSQLModel);

export default WebSQLModel;