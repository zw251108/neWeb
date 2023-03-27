import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                       from '../user/model.js';
import {tagsBelongsTo, TAG_CONTENT_TYPE}       from '../tag/model.js';
import {imagesBelongsTo, IMAGE_CONTENT_TYPE}   from '../image/model.js';

let Blog = db.define('blog', {
		...commonAttr
	
		, title: DataTypes.STRING
		, content: DataTypes.TEXT
		, status: DataTypes.INTEGER
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
		, secret: DataTypes.INTEGER
		, question: DataTypes.STRING
		, answer: DataTypes.STRING
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(Blog, 'blog');

tagsBelongsTo(Blog, TAG_CONTENT_TYPE.blog);

imagesBelongsTo(Blog, IMAGE_CONTENT_TYPE.blog);

export default Blog;