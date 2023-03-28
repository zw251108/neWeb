import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                       from '../user/model.js';
// import {tagsBelongsTo, TAG_CONTENT_TYPE}       from '../tag/model.js';

let Image = db.define('image', {
		id: commonAttr.id
		, creatorId: commonAttr.creatorId
		, createDate: commonAttr.createDate
		, src: DataTypes.STRING
		, width: DataTypes.INTEGER
		, height: DataTypes.INTEGER
		, desc: DataTypes.STRING
		, tags: {
			type: DataTypes.STRING
			, get(){
				let tags = this.getDataValue('tags')
					;

				if( tags ){
					return tags.split(',')
				}

				return [];
			}
		}
		, status: DataTypes.INTEGER
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	, Album = db.define('album', {
		...commonAttr

		, name: DataTypes.STRING
		, desc: DataTypes.STRING
		, num: DataTypes.INTEGER
		, tags: {
			type: DataTypes.STRING
			, get(){
				let tags = this.getDataValue('tags')
					;

				if( tags ){
					return tags.split(',')
				}

				return [];
			}
		}
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
	, ContentImage = db.define('content_image', {
		id: commonAttr.id
		, createDate: commonAttr.createDate

		, imageId: {
			type: DataTypes.INTEGER
			, field: 'image_id'
		}
		, contentId: {
			type: DataTypes.INTEGER
			, field: 'content_id'
		}
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	, IMAGE_CONTENT_TYPE = {
		blog: 1
		, document: 2
		, valhalla: 9
	}
	;

Album.belongsToMany(Image, {
	as: 'image'
	, through: AlbumImage
	, constraints: false
});
Image.belongsToMany(Album, {
	as: 'album'
	, through: AlbumImage
	, constraints: false
});

userBeCreatorOf(Image, 'image');
userBeCreatorOf(Album, 'album');

// tagsBelongsTo(Album, TAG_CONTENT_TYPE.album);
// tagsBelongsTo(Image, TAG_CONTENT_TYPE.image);

export default Image;

export {
	Image
	, Album
	, AlbumImage
	, IMAGE_CONTENT_TYPE
};

export function imagesBelongsTo(Target, contentType){
	Target.belongsToMany(Image, {
		through: {
			model: ContentImage
			, unique: false
		}
		, foreignKey: 'content_id'
		, constraints: false
	});

	Image.belongsToMany(Target, {
		through: {
			model: ContentImage
			, unique: false
			, scope: {
				contentType
			}
		}
		, foreignKey: 'image_id'
		, constraints: false
	});
}