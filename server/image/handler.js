import {where, parse} from '../db.js';
import {Image, Album} from './model.js';

const album = {
		list({creatorId, page, size}
		     , attributes
		     , order=[['id', 'DESC']]){

			page = parse(page, 1);
			size = parse(size, 20)

			return Album.findAll({
				where: {
					...where.eq({
						creatorId
					})
				}
				, offset: (page -1)* size
				, limit: size
				, order
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
		, get({id}, attributes, imageAttr){
			return Album.findOne({
				where: {
					...where.eq({
						id
					})
				}
				, include: [{
					model: Image
					, as: 'image'
					, attributes: imageAttr
				}]
				, attributes
			});
		}
		, create({name, desc}){
			return Album.create({
				name
				, desc
			});
		}
	}
	, image = {
		list({albumId, creatorId, page, size}
		     , attributes
		     , order=[['id', 'DESC']]
		     , albumAttr=['id', 'name']){

			page = parse(page, 1);
			size = parse(size, 20)

			return Image.findAll({
				where: {
					...where.eq({
						creatorId
					})
				}
				, include: [{
					model: Album
					, as: 'album'
					, attributes: albumAttr
					, where: albumId ? {
						...where.eq({
							id: albumId
						})
					}: undefined
				}]
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
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
		, get({id}, attributes){
			return Image.findOne({
				where: {
					...where.eq({
						id
					})
				}
				, attributes
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