import {where, parse}  from '../../db.js';
import Page, {PageLog} from './model.js';

export default {
	list({project, path, menu, desc, state, page, size}
	     , attributes
	     , order=[['id', 'DESC']]){

		page = parse(page, 1);
		size = parse(size, 20);

		return Page.findAll({
			where: {
				...where.eq({
					project
					, state
				})
				, ...where.like({
					path
					, menu
					, description: desc
				})
			}
			, offset: (page -1) * size
			, limit: size
			, attributes
			, order
		});
	}
	, count({project, path, menu, desc, state}){
		return Page.count({
			where: {
				...where.eq({
					project
					, state
				})
				, ...where.like({
					path
					, menu
					, description: desc
				})
			}
		});
	}
	, get({id, project, path, state}, attributes){
		return Page.findOne({
			where: {
				...where.eq({
					id
					, project
					, path
					, state
				})
			}
			, attributes
		});
	}
	, create({path, menu, project, description, config}){
		return Page.create({
			path
			, menu
			, project
			, description
			, config
		});
	}
	, update({path, menu, project, description, config, id}){
		if( !id ){
			return Promise.reject( new Error('缺少 id') );
		}

		/**
		 * 查询现有数据，创建 log，保存新数据
		 * */
		return Page.findOne({
			...where.eq({
				id
			})
		}).then((data)=>{
			return PageLog.create({
				pageId: id
				, lastVersion: data.config
				, lastDesc: data.description
				, currVersion: config
				, currDesc: description
			});
		}).then(()=>{
			return Page.update({
				path
				, menu
				, project
				, description
				, config
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		});
	}
	, changeState({state, id}){
		if( !id ){
			return Promise.reject( new Error('缺少 id') );
		}

		state = parse(state, 1);

		state = +!state;

		return Page.update({
			state
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
};