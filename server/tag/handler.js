import {where, parse, literal} from '../db.js';
import {Tag, ContentTag}       from './model.js';

export default {
	list({name, creatorId, page, size}){
		page = parse(page, 1);
		size = parse(size, 20);

		return Tag.findAll({
			where: {
				...where.eq({
					creatorId
				})
				, ...where.like({
					name
					, description: name
				})
			}
			, order: [
				['id', 'DESC']
			]
			, offset: (page -1)* size
			, limit: size
		});
	}
	, count({name, creatorId}){
		return Tag.count({
			where: {
				...where.eq({
					creatorId
				})
				, ...where.like({
					name
				})
			}
		});
	}
	, create({name, description}){
		return Tag.create({
			name
			, description
		});
	}
	, update({id, name, description}){
		return Tag.update({
			name
			, description
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
	, increase({id, num=1}){
		return Tag.update({
			num: literal(`num+${num}`)
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
	, contentTag({ids, type}){
		return ContentTag.findAll({
			where: {
				...where.eq({
					type
				})
				, ...where.in({
					contentId: ids
				})
			}
		});
	}
};