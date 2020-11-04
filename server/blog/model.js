import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userHasMany} from '../user/model.js';

let Blog = db.define('blog', {
		...commonAttr
	
		, title: DataTypes.STRING
		, content: DataTypes.TEXT
		, status: {
			type: DataTypes.INTEGER
		}
		, tags: {
			type: DataTypes.TEXT
		}
		, tagList: {
			type: DataTypes.VIRTUAL
			, get(){
				if( this.tags ){
					return this.tags.split(',');
				}
				
				return [];
			}
		}
		, readNum: {
			type: DataTypes.INTEGER
			, defaultValue: 1
			, field: 'read_num'
		}
		, replyNum: {
			type: DataTypes.INTEGER
			, defaultValue: 1
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

userHasMany(Blog, 'blog');

export default Blog;