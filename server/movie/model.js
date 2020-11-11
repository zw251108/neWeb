import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userHasMany}                           from '../user/model.js';

let Movie = db.define('movie', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

userHasMany(Movie, 'movie');

export default Movie;