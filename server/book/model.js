import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userHasMany}                           from '../user/model.js';

let Book = db.define('book', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

userHasMany(Book, 'book');

export default Book;