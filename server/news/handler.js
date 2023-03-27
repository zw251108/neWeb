import {where, parse} from '../db.js';
import News           from './model.js';

export default {
	list({type, creatorId, page, size}
	     , attributes
	     , order=[['createDate', 'DESC']]){

		page = parse(page, 1);
		size = parse(size, 20);

		return News.findAll({
			where: {
				...where.eq({
					type
					, creatorId
				})
			}
			, offset: (page -1)* size
			, limit: size
			, attributes
			, order
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