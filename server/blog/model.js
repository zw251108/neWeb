import db, {DataTypes, commonAttr, commonOpts}     from '../db.js';
import {userBeCreatorOf}                           from '../user/model.js';
import {tagsAttr, tagsBelongsTo, TAG_CONTENT_TYPE} from '../tag/model.js';
import {Image, imagesBelongsTo, IMAGE_CONTENT_TYPE}   from '../image/model.js';

let Blog = db.define('blog', {
		...commonAttr
	
		, title: DataTypes.STRING
		, content: DataTypes.TEXT
		, status: DataTypes.INTEGER
		, cover: DataTypes.STRING
		, short: DataTypes.STRING
		, tags: tagsAttr
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
	, BlogCover = db.define('blog_cover', {
		...commonAttr

		, blogId: {
			type: DataTypes.INTEGER
			, field: 'blog_id'
		}
		, imageId: {
			type: DataTypes.INTEGER
			, field: 'image_id'
		}
	})
	;

userBeCreatorOf(Blog, 'blog');

Blog.hasOne(Image, {
	as: 'cover'
	, through: BlogCover
	, constraints: false
});

Image.hasMany(Blog, {
	as: 'blog'
	, through: BlogCover
	, constraints: false
});

// tagsBelongsTo(Blog, TAG_CONTENT_TYPE.blog);

// imagesBelongsTo(Blog, IMAGE_CONTENT_TYPE.blogCover);
// imagesBelongsTo(Blog, IMAGE_CONTENT_TYPE.blogContent);

export default Blog;