import {where, parse} from '../db.js';
import Blog           from './model.js';
import News           from '../news/model.js';
import Image          from '../image/model.js';
// import Tag            from '../tag/model.js';

export default {
	list({title, tags, creatorId, status, page=1, size=20}
	     , attributes
	     , order=[['id', 'DESC']]
	     , imgAttr=['id', 'src']){

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
			, include: [{
				model: Image
				, as: 'cover'
				, attribute: imgAttr
			}]
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
	, get({id, creatorId, status, answer}, attributes){
		return Blog.findOne({
			where: {
				...where.eq({
					id
					, creatorId
					, status
					, answer
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
	, create({title, cover, short, content, tags, status}){
		return Blog.create({
			title
			, cover
			, short
			, content
			, tags
			, status
			, creatorId: 1
		}).then((data)=>{
			return News.create({
				targetId: data.id
				, type: 'blog'
				, content: {
					title
					, preview: cover
					, content: short
					, tags: tags ? tags.split(',') :[]
				}
				, status
				, creatorId: 1
			}).then(()=>{
				return data;
			});
		});
	}
	, update({id, title, cover, short, content, tags, status}){
		return Blog.update({
			title
			, cover
			, short
			, content
			, tags
			, status
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
					, preview: cover
					, content: short
					, tags: tags ? tags.split(',') : []
				}
				, status
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
	, setPwd({id, question, answer}){
		return Blog.update({
			status: 3
			, question
			, answer
		}, {
			where: {
				...where.eq({
					id
				})
			}
		}).then(()=>{
			return News.update({
				password: 1
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
	, rmPwd({id}){
		return Blog.update({
			status: 1
		}, {
			where: {
				...where.eq({
					id
				})
			}
		}).then(()=>{
			return News.update({
				password: 0
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