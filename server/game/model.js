import db, {DataTypes, commonAttr, commonOpts, TAG_CONTENT_TYPE} from '../db.js';
import {userBeCreatorOf}                           from '../user/model.js';
import {tagsBelongsTo}                         from '../tag/model.js';

let Game = db.define('game', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(Game, 'game');

tagsBelongsTo(Game, TAG_CONTENT_TYPE.game);

export default Game;