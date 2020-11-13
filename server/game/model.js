import db, {DataTypes, commonAttr, commonOpts} from '../db.js';

let Game = db.define('game', {
		...commonAttr
	}, {
		...commonOpts
	})
	;

export default Game;