import db, {DataTypes, commonAttr, commonOpts} from '../db.js';

let Words = db.define('words', {
		...commonAttr

		, content: DataTypes.TEXT
		, status: DataTypes.INTEGER
	}, {
		...commonOpts
	})
	;

export default Words;