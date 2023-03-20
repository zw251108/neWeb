import {where, parse} from '../db.js';
import {Image, Album} from './model.js';

const album = {
		list({creatorId, page, size}){
			page = parse(page, 1);
			size = parse(size, 20)

			return Album.findAll({
				where: {
					...where.eq({
						creatorId
					})
				}
				, order: [
					['id', 'DESC']
				]
				, offset: (page -1)* size
				, limit: size
			})
		}
		, count({creatorId}){
			return Album.count({
				where: {
					...where.eq({
						creatorId
					})
				}
			});
		}
		, get({id}){
			return Album.findOne({
				where: {
					...where.eq({
						id
					})
				}
				, include: [{
					model: Image
					, as: 'image'
				}]
			})
		}
	}
	, image = {
		list({albumId, creatorId, page, size}){
			page = parse(page, 1);
			size = parse(size, 20)

			const include = [{
					model: Album
					, as: 'album'
				}]
				;

			if( albumId ){
				include[0].where = {
					...where.eq({
						id: albumId
					})
				}
			}

			return Image.findAll({
				where: {
					...where.eq({
						creatorId
					})
				}
				, include
				, order: [
					['id', 'DESC']
				]
				, offset: (page -1)* size
				, limit: size
			})
		}
		, count({creatorId}){
			return Image.count({
				where: {
					...where.eq({
						creatorId
					})
				}
			});
		}
		, get({id}){
			return Image.findOne({
				attributes: ['id', 'src', 'width', 'height', 'albumId', 'desc', 'createDate']
				, where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	;
export default {
	album
	, image
};

export {
	album
	, image
};