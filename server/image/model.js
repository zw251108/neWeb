import db, {DataTypes, commonAttr, commonOpts, TAG_CONTENT_TYPE} from '../db.js';
import {userBeCreatorOf}                                         from '../user/model.js';
import {tagsBelongsTo}                                           from '../tag/model.js';

let Image = db.define('image', {
		id: commonAttr.id
		, creatorId: commonAttr.creatorId
		, createDate: commonAttr.createDate
		, src: DataTypes.STRING
		, width: DataTypes.INTEGER
		, height: DataTypes.INTEGER
		, desc: DataTypes.STRING
		// , albumId: {
		// 	type: DataTypes.INTEGER
		// 	, field: 'album_id'
		// }
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	, Album = db.define('album', {
		...commonAttr

		, name: DataTypes.STRING
		, desc: DataTypes.STRING
		, num: DataTypes.INTEGER
		// , tags: DataTypes.TEXT
		, status: DataTypes.INTEGER
	}, {
		...commonOpts
	})
	, AlbumImage = db.define('image_album', {
		id: commonAttr.id
		, createDate: commonAttr.createDate

		, albumId: {
			type: DataTypes.INTEGER
			, field: 'album_id'
			, references: {
				model: Album
				, key: 'id'
			}
		}
		, imageId: {
			type: DataTypes.INTEGER
			, field: 'image_id'
			, references: {
				model: Image
				, key: 'id'
			}
		}
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	;

userBeCreatorOf(Image, 'image');
userBeCreatorOf(Album, 'album');

// Album.hasMany(Image, {
// 	foreignKey: 'album_id'
// 	, as: 'image'
// 	// , through: 'album_image'
// 	, constraints: false
// });
// Image.belongsTo(Album, {
// 	foreignKey: 'album_id'
// 	, as: 'album'
// 	// , through: 'album_image'
// 	, constraints: false
// });
Album.belongsToMany(Image, {
	as: 'image'
	, through: AlbumImage
	, constraints: false
});
Image.belongsToMany(Album, {
	as: 'album'
	, through: AlbumImage
	, constraints: false
})

tagsBelongsTo(Album, TAG_CONTENT_TYPE.album);
tagsBelongsTo(Image, TAG_CONTENT_TYPE.image);

export default Image;

export {
	Image
	, Album
	, AlbumImage
};