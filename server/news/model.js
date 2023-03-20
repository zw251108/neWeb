import db, {DataTypes, commonAttr, commonOpts, TAG_CONTENT_TYPE} from '../db.js';
import {userBeCreatorOf}   from '../user/model.js';
import {tagsBelongsTo} from '../tag/model.js';

let News = db.define('news', {
		id: commonAttr.id
		, creatorId: commonAttr.creatorId
		, createDate: commonAttr.createDate
	
		// , title: DataTypes.STRING
		// , desc: DataTypes.STRING
		// , src: DataTypes.STRING
		, type: DataTypes.STRING
		, targetId: {
			type: DataTypes.INTEGER
			, field: 'target_id'
		}
		, content: {
			type: DataTypes.JSON
		}
		, status: DataTypes.INTEGER
		// , tags: {
		// 	type: DataTypes.TEXT
		// }
		// , tagList: {
		// 	type: DataTypes.VIRTUAL
		// 	, get(){
		// 		if( this.tags ){
		// 			return this.tags.split(',');
		// 		}
		//
		// 		return [];
		// 	}
		// }
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(News, 'news');

// tagsBelongsTo(News, TAG_CONTENT_TYPE.blog);

export default News;