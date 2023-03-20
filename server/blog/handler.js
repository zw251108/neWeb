import {where, parse} from '../db.js';
import Blog           from './model.js';
import Page           from '../mg/page/model.js';
export default {
	list({title, tags, creatorId, status, page=1, size=20},
	     attrs=['id', 'title', 'status', 'createDate', 'updateDate']){

		page = parse(page, 1);
		size = parse(size, 20);

		return Blog.findAll({
			attributes: attrs
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