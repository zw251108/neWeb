import {where, parse}  from '../../db.js';
import Code, {CodeLog} from './model.js';

export default {
	list({desc, type, page, size}
	     , attributes
	     , order=[['id', 'DESC']]){

		page = parse(page, 1);
		size = parse(size, 20);

		return Code.findAll({
			where: {
				...where.eq({
					type
				})
				, ...where.like({
					description: desc
				})
			}
			, offset: (page -1) * size
			, limit: size
			, attributes
			, order
		});
	}
	, count({desc, type}){
		return Code.count({
			where: {
				...where.like({
					type
					, description: desc
				})
			}
		});
	}
	, get({id}, attributes){
		return Code.findOne({
			where: {
				...where.eq({
					id
				})
			}
			, attributes
		});
	}
	, create({code, description}){
		return Code.create({
			code
			, description
		});
	}
	, update({code, description, id}){
		return Code.findOne({
			...where.eq({
				id
			})
		}).then((data)=>{
			return CodeLog.create({
				codeId: id
				, lastVersion: data.code
				, lastDesc: data.description
				, currVersion: code
				, currDesc: description
			});
		}).then(()=>{
			return Code.update({
				code
				, description
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		});
	}

	, getByIds({ids}
	           , attributes=['id', 'code']){
		
		return Code.findAll({
			where: {
				...where.in({
					id: ids
				})
			}
			, attributes
		});
	}
};