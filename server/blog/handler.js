import {where, parse} from '../db.js';
import Blog           from './model.js';
import News           from '../news/model.js';
// import Tag            from '../tag/model.js';

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
				, ...where.or([
					where.like({
						title
					})
					, where.like({
						content: title
					})
				])
				, ...where.like({
					tags
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
				, ...where.or([
					where.like({
						title
					})
					, where.like({
						content: title
					})
				])
				, ...where.like({
					tags
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
			// , include: [{
			// 	model: Tag
			// 	, attributes: ['id', 'name']
			// 	, through: {
			// 		attributes: []
			// 	}
			// }]
			, attributes
		});
	}
	, create({title, short, content, tags}){
		return Blog.create({
			title
			, short
			, content
			, tags
			, creatorId: 1
		}).then((data)=>{
			return News.create({
				targetId: data.id
				, type: 'blog'
				, content: {
					title
					, content: short
				}
				, creatorId: 1
			}).then(()=>{
				return data;
			});
		});
	}
	, update({id, title, short, content, tags}){
		return Blog.update({
			title
			, short
			, content
			, tags
		}, {
			where: {
				...where.eq({
					id
				})
			}
		}).then(()=>{
			return News.update({
				content: {
					title
					, content: short
				}
			}, {
				where: {
					...where.eq({
						targetId: id
						, type: 'blog'
					})
				}
			});
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
		}).then(()=>{
			return News.update({
				status
			}, {
				where: {
					...where.eq({
						targetId: id
						, type: 'blog'
					})
				}
			});
		});
	}
};