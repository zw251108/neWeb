import db, {DataTypes, commonAttr} from '../db.js';

// import {imagesBelongsTo, IMAGE_CONTENT_TYPE} from '../image/model.js';

let Valhalla = db.define('valhalla', {
		id: commonAttr.id
	
		, name: DataTypes.STRING
		, path: {
			type: DataTypes.TEXT
			, get(){
				let path = this.getDataValue('path')
					;

				if( path ){
					return path.split(',')
				}

				return [];
			}
		}
		, start: DataTypes.DATE
		, end: DataTypes.DATE
		, description: DataTypes.TEXT
		, weight: DataTypes.INTEGER
	}, {
		createdAt: false
		, updatedAt: false
	})
	;

// imagesBelongsTo(Valhalla, IMAGE_CONTENT_TYPE.valhalla);

export default Valhalla;