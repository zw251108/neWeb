import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userHasMany}                           from '../user/model.js';

let Tag = db.define('tag', {
		id: commonAttr.id
		, creatorId: commonAttr.creatorId
		, createDate: commonAttr.createDate

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
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	, ContentTag = db.define('content_tag', {
		id: commonAttr.id
		, tagId: {
			type: DataTypes.STRING
			, field: 'tag_id'
		}
		, contentId: {
			type: DataTypes.STRING
			, field: 'content_id'
		}
	})
	;

userHasMany(Tag, 'tag');

export default Tag;

export {
	Tag
	, ContentTag
}

export function tagsBelongsTo(Target, through, as){
	Tag.belongsToMany(Target, {
		through
		, as
		, constraints: false
	});
}