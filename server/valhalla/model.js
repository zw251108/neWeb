import db, {DataTypes, commonAttr} from '../db.js';

import {imagesBelongsTo, IMAGE_CONTENT_TYPE} from '../image/model.js';

let Valhalla = db.define('valhalla', {
		id: commonAttr.id
	
		, name: DataTypes.STRING
		// , path: DataTypes.TEXT
		, start: DataTypes.DATE
		, end: DataTypes.DATE
		, description: DataTypes.TEXT
		, weight: DataTypes.INTEGER
	}, {
		createdAt: false
		, updatedAt: false
	})
	;

imagesBelongsTo(Valhalla, IMAGE_CONTENT_TYPE.valhalla);

export default Valhalla;