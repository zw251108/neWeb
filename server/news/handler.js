import {where, parse} from '../db.js';
import News           from './model.js';

export default {
	list({type, status, creatorId, page, size}
	     , attributes
	     , order=[['createDate', 'DESC']]){

		page = parse(page, 1);
		size = parse(size, 20);

		return News.findAll({
			where: {
				...where.eq({
					type
					, status
					, creatorId
				})
			}
			, offset: (page -1)* size
			, limit: size
			, attributes
			, order
		});
	}
	, count({type, status, creatorId}){
		return News.count({
			where: {
				...where.eq({
					type
					, status
					, creatorId
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
	, changeStatus({status, id}){
		if( !id ){
			return Promise.reject( new Error('缺少 id') );
		}

		status = parse(status, 1);

		status = +!status;

		return News.update({
			status
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
};