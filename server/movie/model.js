import db, {DataTypes, commonAttr, commonOpts} from '../db.js';

let Movie = db.define('movie', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

export default Movie;