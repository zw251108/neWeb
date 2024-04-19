import db, {DataTypes, commonAttr, commonOpts}     from '../db.js';
import {userBeCreatorOf}                           from '../user/model.js';
import {tagsBelongsTo, TAG_CONTENT_TYPE, tagsAttr} from '../tag/model.js';

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
			, set: tagsAttr.set
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
		, tags: tagsAttr
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
		, tags: tagsAttr
		, lastPub: {
			type: DataTypes.DATE
			, field: 'last_pub'
		}
	}, {
		createdAt: 'last_pub'
		, updatedAt: false
	})
	
	, Web = db.define('web', {
		id: commonAttr.id
		, url: DataTypes.STRING
		, ico: DataTypes.STRING
	})
	;

userBeCreatorOf(Bookmark, 'bookmark');
userBeCreatorOf(Reader, 'reader');

// User.belongsToMany(Bookmark, {
// 	through: UserBookmark
// 	, constraints: false
// });
// Bookmark.belongsToMany(User, {
// 	through: UserBookmark
// 	, constraints: false
// });
//
Bookmark.hasMany(UserBookmark, {
	foreignKey: 'bookmark_id'
	, as: 'usermark'
	, constraints: false
});
UserBookmark.belongsTo(Bookmark, {
	foreignKey: 'bookmark_id'
	, as: 'bookmark'
	, constraint: false
});

Web.hasMany(Reader, {
	foreignKey: 'html_url'
	, sourceKey: 'url'
	, as: 'reader'
	, constraint: false
});
Reader.belongsTo(Web,  {
	foreignKey: 'html_url'
	, targetKey: 'url'
	, as: 'web'
	, constraint: false
});

Web.hasMany(Bookmark, {
	foreignKey: 'source'
	, sourceKey: 'url'
	, as: 'bookmark'
	, constraint: false
});
Bookmark.belongsTo(Web,  {
	foreignKey: 'source'
	, targetKey: 'url'
	, as: 'web'
	, constraint: false
});

// tagsBelongsTo(UserBookmark, TAG_CONTENT_TYPE.bookmark);

// export default Bookmark;

export {
	Bookmark
	, UserBookmark

	, Reader
	
	, Web
};