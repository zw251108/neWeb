import {where, parse} from '../db.js';
import Editor         from './model.js';
import News           from '../news/model.js';

export default {
	list({name, tags, creatorId, status, page=1, size=20}
		, attributes
		, order=[['id', 'DESC']]){
		page = parse(page, 1);
		size = parse(size, 20);

		return Editor.findAll({
			where: {
				...where.eq({
					creatorId
					, status
				})
				, ...where.or([
					where.like({
						name
					})
					, where.like({
						description: name
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
	, count({name, tags, creatorId, status}){
		return Editor.count({
			where: {
				...where.eq({
					creatorId
					, status
				})
				, ...where.or([
					where.like({
						name
					})
					, where.like({
						description: name
					})
				])
				, ...where.like({
					tags
				})
			}
		});
	}
	, get({id, creatorId, status}, attributes){
		return Editor.findOne({
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
	, create({name, html, css, js, tags, preview, description}){
		return Editor.create({
			name
			, html
			, css
			, js
			, tags
			, preview
			, description
		}).then((data)=>{
			return News.create({
				targetId: data.id
				, type: 'code'
				, content: {
					title: name
					, src: preview
					, tags: tags ? tags.split(',') :[]
				}
				, creatorId: 1
			}).then(()=>{
				return data;
			});
		});
	}
	, update({id, name, html, css, js, tags, preview, description}){
		return Editor.update({
			html
			, css
			, js
			, tags
			, preview
			, description
		}, {
			where: {
				...where.eq({
					id
				})
			}
		}).then(()=>{
			return News.update({
				content: {
					title: name
					, src: preview
					, tags: tags ? tags.split(',') : []
				}
			}, {
				where: {
					...where.eq({
						targetId: id
						, type: 'code'
					})
				}
			});
		});
	}
	, changeStatus({status, id}){
		if( !id ){
			return Promise.reject( new Error('缺少 id') );
		}

		status = parse(status, 1);

		status = +!status;

		return Editor.update({
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
						, type: 'code'
					})
				}
			});
		});
	}
}