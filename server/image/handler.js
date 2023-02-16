import {Image, Album, AlbumImage}   from './model.js';

export default {
	list(where, page=1, size=20){
		return Album.findAll({
			attributes: ['id', 'name', 'updateDate', 'num']
			, where
			, order: [
				['id', 'DESC']
			]
			, offset: (page -1)* size
			, limit: size
		})
	}
	, album(where){
		return Album.findOne({
			where
			, include: [{
				model: Image
				, as: 'image'
			}]
		})
	}
	, get(where){
		return Image.findOne({
			attributes: ['id', 'src', 'width', 'height', 'albumId', 'desc']
			, where
		});
	}
};