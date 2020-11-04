import db, {DataTypes, commonAttr}  from '../db.js';
import {userHasMany}    from '../user/model.js';

let Tag = db.define('tag', {
		id: commonAttr.id
		, creatorId: commonAttr.creatorId

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

userHasMany(Tag, 'tag');

export default Tag;

export function tagBelongsTo(Target){
	// Target.hasMany(Tag, {
	// 	foreignKey
	// })
}