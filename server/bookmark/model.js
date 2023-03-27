import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import User, {userBeCreatorOf}                 from '../user/model.js';
import {tagsBelongsTo, TAG_CONTENT_TYPE}       from '../tag/model.js';

let Bookmark = db.define('bookmark', {
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
	, UserBookmark = db.define('user_bookmark', {
		id: commonAttr.id
		, bookmarkId: {
			type: DataTypes.STRING
			, field: 'bookmark_id'
		}
		, userId: {
			type: DataTypes.STRING
			, field: 'user_id'
		}
		, title: DataTypes.STRING
		, score: DataTypes.INTEGER
		, status: DataTypes.INTEGER
		, markDate: {
			type: DataTypes.DATE
			, field: 'mark_datetime'
		}
		, readDate: {
			type: DataTypes.DATE
			, field: 'read_datetime'
		}
	}, {
		createdAt: 'mark_datetime'
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

userBeCreatorOf(Bookmark, 'bookmark');
userBeCreatorOf(Reader, 'reader');

User.belongsToMany(Bookmark, {
	through: UserBookmark
	, constraints: false
});
Bookmark.belongsToMany(User, {
	through: UserBookmark
	, constraints: false
});

Bookmark.hasMany(UserBookmark, {
	as: 'usermark'
	, constraints: false
});

tagsBelongsTo(UserBookmark, TAG_CONTENT_TYPE.bookmark);

export default Bookmark;

export {
	Bookmark
	, UserBookmark

	, Reader
};