import db, {DataTypes} from '../db.js';

let Blog = db.define('blog', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, userId: {
			type: DataTypes.STRING
		}
		, title: DataTypes.STRING
		, content: DataTypes.TEXT
		, datetime: {
			type: DataTypes.DATE
			, defaultValue: DataTypes.NOW
		}
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

		, lastUpdate: {
			type: DataTypes.DATE
			, defaultValue: DataTypes.NOW
			, field: 'last_update'
		}
	}, {
		createdAt: 'datetime'
		, updatedAt: 'lastUpdate'
	})
	;

export default Blog;