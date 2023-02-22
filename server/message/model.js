import db, {DataTypes, commonAttr} from '../db.js';
import {userBeCreatorOf}               from '../user/model.js';

let Message = db.define('message', {
		id: commonAttr.id


	}, {

	})
	;

userBeCreatorOf(Message, 'message');

export default Message;