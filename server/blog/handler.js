import {where} from '../db.js';
import Blog    from './model.js';

export default {
	list({title, tags, creatorId, status}, page=1, size=20){
		return Blog.findAll({
			attributes: ['id', 'title', 'updateDate']
			, where: {
				...where.eq({
					creatorId
					, status
				})
				, ...where.like({
					title
					, content: title
					, tags
				})
			}
			, order: [
				['id', 'DESC']
			]
			, offset: (page -1)* size
			, limit: size
		});
	}
	, get({id, creatorId, status}){
		return Blog.findOne({
			where: {
				...where.eq({
					id
					, creatorId
					, status
				})
			}
		});
	}
	, create(data){
		return Blog.create( data );
	}
	, update(data, where){
		return Blog.update(data, {
			where
		});
	}
	, del(){
		
	}
};