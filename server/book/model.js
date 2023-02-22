import db, {DataTypes, commonAttr, commonOpts, TAG_CONTENT_TYPE}    from '../db.js';
import {userBeCreatorOf}   from '../user/model.js';
import {tagsBelongsTo} from '../tag/model.js';

let Book = db.define('book', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(Book, 'book');

tagsBelongsTo(Book, TAG_CONTENT_TYPE.book);

export default Book;