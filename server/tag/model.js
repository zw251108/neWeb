import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                       from '../user/model.js';

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
	, TAG_CONTENT_TYPE = {
		favorite: 0
		, blog: 1
		, document: 2
		, editor: 3
		, todo: 4
		, reader: 5
		, bookmark: 6
		, image: 7
		, book: 8
		, movie: 9
		, game: 10
		, album: 11
	}
	;

userBeCreatorOf(Tag, 'tag');

export default Tag;

export {
	Tag
	, ContentTag
	, TAG_CONTENT_TYPE
};

export function tagsBelongsTo(Target, contentType){
	Target.belongsToMany(Tag, {
		through: {
			model: ContentTag
			, unique: false
		}
		, foreignKey: 'content_id'
		, constraints: false
	});

	Tag.belongsToMany(Target, {
		through: {
			model: ContentTag
			, unique: false
			, scope: {
				contentType
			}
		}
		, foreignKey: 'tag_id'
		, constraints: false
	});
}