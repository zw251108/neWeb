import {where, parse} from '../db.js';
import News           from './model.js';

export default {
	list(where, page=1, size=20){
		page = parse(page, 1);
		size = parse(size, 20);

		return News.findAll({
			attributes: ['id', 'type', 'targetId', 'content', 'createDate']
			, where
			, order: [
				['createDate', 'DESC']
			]
			, offset: (page -1)* size
			, limit: size
		});
	}
	, create(data){
		return News.create( data );
	}
};