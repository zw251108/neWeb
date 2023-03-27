import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                       from '../user/model.js';
import {tagsBelongsTo, TAG_CONTENT_TYPE}       from '../tag/model.js';

let Movie = db.define('movie', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(Movie, 'movie');

tagsBelongsTo(Movie, TAG_CONTENT_TYPE.movie);

export default Movie;