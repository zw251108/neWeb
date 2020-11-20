import db, {DataTypes, commonAttr, commonOpts, TAG_CONTENT_TYPE} from '../db.js';
import {userBeCreatorOf}                                             from '../user/model.js';
import {tagsBelongsTo}                                           from '../tag/model.js';

let Image = db.define('image', {
		id: commonAttr.id
		, creatorId: commonAttr.creatorId
		, createDate: commonAttr.createDate

		, src: DataTypes.STRING
		, width: DataTypes.INTEGER
		, height: DataTypes.INTEGER
		, desc: DataTypes.STRING
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	, Album = db.define('album', {
		...commonAttr

		, name: DataTypes.STRING
		, desc: DataTypes.STRING
		, tags: DataTypes.TEXT
		, status: DataTypes.INTEGER
	}, {
		...commonOpts
	})
	, AlbumImage = db.define('image_album', {
		id: commonAttr.id
		, createDate: commonAttr.createDate

		, albumId: {
			type: DataTypes.STRING
			, field: 'album_id'
		}
		, imageId: {
			type: DataTypes.STRING
			, field: 'image_id'
		}
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	;

userBeCreatorOf(Image, 'image');
userBeCreatorOf(Album, 'album');

Album.hasMany(Image, {
	foreignKey: 'image_id'
	, as: 'album'
	, through: 'album_image'
	, constraints: false
});
Image.belongsToMany(Album, {
	foreignKey: 'album_id'
	, as: 'image'
	, through: 'album_image'
	, constraints: false
});

tagsBelongsTo(Album, TAG_CONTENT_TYPE.album);
tagsBelongsTo(Image, TAG_CONTENT_TYPE.image);

export default Image;

export {
	Image
	, Album
	, AlbumImage
};