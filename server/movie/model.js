import db, {DataTypes, commonAttr, commonOpts, TAG_CONTENT_TYPE} from '../db.js';
import {userBeCreatorOf}                           from '../user/model.js';
import {tagsBelongsTo}                         from '../tag/model.js';

let Movie = db.define('movie', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(Movie, 'movie');

tagsBelongsTo(Movie, TAG_CONTENT_TYPE.movie);

export default Movie;