import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                           from '../user/model.js';

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
		, createDate: commonAttr.createDate

		, tagId: {
			type: DataTypes.STRING
			, field: 'tag_id'
		}
		, contentId: {
			type: DataTypes.STRING
			, field: 'content_id'
		}
		, contentType: {
			type: DataTypes.INTEGER
			, field: 'content_type'
		}
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	;

userBeCreatorOf(Tag, 'tag');

export default Tag;

export {
	Tag
	, ContentTag
};

export function tagsBelongsTo(Target, contentType){
	Target.belongsToMany(Tag, {
		through: {
			model: ContentTag
			, unique: false
			, scope: {
				contentType
			}
		}
		, foreignKey: 'content_id'
		, constraints: false
	});

	Tag.belongsToMany(Target, {
		through: {
			model: ContentTag
			, unique: false
		}
		, foreignKey: 'tag_id'
		, constraints: false
	});
}