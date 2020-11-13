import db, {DataTypes, commonAttr, commonOpts} from '../db.js';

let Book = db.define('book', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

export default Book;