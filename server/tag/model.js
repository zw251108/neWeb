import db, {DataTypes} from '../db.js';

let Tag = db.define('tag', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, userId: {
			type: DataTypes.STRING
			, field: 'user_id'
		}
		, name: DataTypes.STRING
		, num: {
			type: DataTypes.INTEGER
			, defaultValue: 1
		}
		, level: {
			type: DataTypes.INTEGER
		}
		, parent: {
			type: DataTypes.STRING
		}
		, parents: {
			type: DataTypes.VIRTUAL
			, get(){
				if( this.parent ){
					return this.parent.split(',')
				}

				return [];
			}
		}
		, description: DataTypes.STRING
	})
	;

export default Tag;