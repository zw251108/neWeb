import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                       from '../user/model.js';
// import {tagsBelongsTo, TAG_CONTENT_TYPE}       from '../tag/model.js';
// import {imagesBelongsTo, IMAGE_CONTENT_TYPE}   from '../image/model.js';

let News = db.define('news', {
		id: commonAttr.id
		, creatorId: commonAttr.creatorId
		, createDate: commonAttr.createDate
	
		, type: DataTypes.STRING
		, targetId: {
			type: DataTypes.INTEGER
			, field: 'target_id'
		}
		, content: {
			type: DataTypes.JSON
			, get(){
				let content = this.getDataValue('content')
					;

				try{
					return JSON.parse( content );
				}
				catch(e){
					return {};
				}
			}
		}
		, weight: DataTypes.INTEGER
		, password: DataTypes.INTEGER
		, status: DataTypes.INTEGER
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	;

userBeCreatorOf(News, 'news');

// tagsBelongsTo(News, TAG_CONTENT_TYPE.blog);

export default News;