import {where, parse} from '../db.js';
import Blog           from './model.js';

export default {
	list({title, tags, creatorId, status, page=1, size=20}
	     , attributes
	     , order=[['id', 'DESC']]){

		page = parse(page, 1);
		size = parse(size, 20);

		return Blog.findAll({
			where: {
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
			, offset: (page -1)* size
			, limit: size
			, attributes
			, order
		});
	}
	, count({title, tags, creatorId, status}){
		return Blog.count({
			where: {
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
		});
	}
	, get({id, creatorId, status}, attributes){
		return Blog.findOne({
			where: {
				...where.eq({
					id
					, creatorId
					, status
				})
			}
			, attributes
		});
	}
	, create({title, short, content}){
		return Blog.create({
			title
			, short
			, content
		});
	}
	, update({id, title, short, content}){
		return Blog.update({
			title
			, short
			, content
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
	, del(){
		
	}
	, changeStatus({status, id}){
		if( !id ){
			return Promise.reject( new Error('缺少 id') );
		}

		status = parse(status, 1);

		status = +!status;

		return Blog.update({
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