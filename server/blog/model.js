import db, {DataTypes, commonAttr, commonOpts, TAG_CONTENT_TYPE} from '../db.js';
import {userBeCreatorOf}   from '../user/model.js';
import {tagsBelongsTo} from '../tag/model.js';

let Blog = db.define('blog', {
		...commonAttr
	
		, title: DataTypes.STRING
		, content: DataTypes.TEXT
		, status: {
			type: DataTypes.INTEGER
		}
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
		, short: DataTypes.STRING
		, readNum: {
			type: DataTypes.INTEGER
			, defaultValue: 1
			, field: 'read_num'
		}
		, replyNum: {
			type: DataTypes.INTEGER
			, defaultValue: 0
			, field: 'reply_num'
		}
		// , lv: DataTypes.INTEGER
		// , documentId: DataTypes.INTEGER
		// , sectionId: DataTypes.INTEGER
		, secret: DataTypes.INTEGER
		, question: DataTypes.STRING
		, answer: DataTypes.STRING
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(Blog, 'blog');

tagsBelongsTo(Blog, TAG_CONTENT_TYPE.blog);

export default Blog;