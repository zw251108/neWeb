import {where, parse} from '../db.js';
import Words          from './model.js';
import News           from '../news/model.js';

export default {
	list({content, creatorId, status, page=1, size=20}
	     , attributes
	     , order=[['id', 'DESC']]){

		page = parse(page, 1);
		size = parse(size, 20);

		return Words.findAll({
			where: {
				...where.eq({
					creatorId
					, status
				})
				, ...where.like({
					content
				})
			}
			, offset: (page -1)* size
			, limit: size
			, attributes
			, order
		});
	}
	, count({content, creatorId, status}){
		return Words.count({
			where: {
				...where.eq({
					creatorId
					, status
				})
				, ...where.like({
					content
				})
			}
		});
	}
	, create({content}){
		return Words.create({
			content
			, status: 1
			, creatorId: 1
		}).then((data)=>{
			return News.create({
				targetId: data.id
				, type: 'words'
				, content: {
					desc: content
				}
				, status: 1
				, creatorId: 1
			}).then(()=>{
				return data;
			});
		});
	}
	, update({id, content}){
		return Words.update({
			content
		}, {
			where: {
				...where.eq({
					id
				})
			}
		}).then(()=>{
			return News.update({
				content: {
					desc: content
				}
			}, {
				where: {
					...where.eq({
						targetId: id
						, type: 'words'
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

		return Words.update({
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
						, type: 'words'
					})
				}
			});
		});
	}
};