import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                       from '../user/model.js';
import {tagsBelongsTo, TAG_CONTENT_TYPE}       from '../tag/model.js';

let Book = db.define('book', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(Book, 'book');

tagsBelongsTo(Book, TAG_CONTENT_TYPE.book);

export default Book;