import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userHasMany}                           from '../user/model.js';

let Bookmark = db.define('reader_bookmark', {
		id: commonAttr.id
		, creatorId: commonAttr.creatorId
		, createDate: commonAttr.createDate

		, title: DataTypes.STRING
		, url: DataTypes.TEXT
		, source: DataTypes.STRING
		, content: DataTypes.TEXT
		, readerNum: {
			type: DataTypes.INTEGER
			, field: 'reader_num'
		}
		, totalScore: {
			type: DataTypes.INTEGER
			, field: 'total_score'
		}
		, totalTags: {
			type: DataTypes.TEXT
			, field: 'total_tags'
		}
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	, Reader = db.define('reader', {
		id: commonAttr.id
		, creatorId: commonAttr.creatorId

		, name: DataTypes.STRING
		, xmlUrl: {
			type: DataTypes.STRING
			, field: 'xml_url'
		}
		, htmlUrl: {
			type: DataTypes.STRING
			, field: 'html_url'
		}
		, type: DataTypes.STRING
		, tags: DataTypes.TEXT
		, lastPub: {
			type: DataTypes.DATE
			, field: 'last_pub'
		}
	}, {
		createdAt: 'last_pub'
		, updatedAt: false
	})
	;

userHasMany(Bookmark, 'bookmark');
userHasMany(Reader, 'reader');

export default Bookmark;

export {
	Bookmark
	, Reader
};