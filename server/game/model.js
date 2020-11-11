import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userHasMany}                           from '../user/model.js';

let Game = db.define('game', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

userHasMany(Game, 'game');

export default Game;