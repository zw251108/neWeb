import db, {DataTypes, commonAttr} from '../db.js';

let Valhalla = db.define('valhalla', {
		id: commonAttr.id
	
		, name: DataTypes.STRING
		, path: DataTypes.TEXT
		, start: DataTypes.DATE
		, end: DataTypes.DATE
		, description: DataTypes.TEXT
		, weight: DataTypes.INTEGER
	})
	;

export default Valhalla;