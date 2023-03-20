import {where, parse} from '../db.js';
import News           from './model.js';

export default {
	list({creatorId, page, size}){
		page = parse(page, 1);
		size = parse(size, 20);

		return News.findAll({
			attributes: ['id', 'type', 'targetId', 'content', 'createDate']
			, where: {
				...where.eq({
					creatorId
				})
			}
			, order: [
				['createDate', 'DESC']
			]
			, offset: (page -1)* size
			, limit: size
		});
	}
	, count({creatorId}){
		return News.count({
			where: {
				...where.eq({
					creatorId
				})
			}
		});
	}
	, create({type, targetId, content}){
		return News.create({
			type
			, targetId
			, content
		});
	}
	, update({id, type, targetId, content}){
		return News.update({
			type
			, targetId
			, content
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
};