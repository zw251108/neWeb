import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                       from '../user/model.js';
import {tagsBelongsTo, TAG_CONTENT_TYPE}       from '../tag/model.js';

let Game = db.define('game', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(Game, 'game');

tagsBelongsTo(Game, TAG_CONTENT_TYPE.game);

export default Game;