import {where, parse, literal} from '../db.js';
import News           from './model.js';

export default {
	list({search, filter, type, status, creatorId, page, size}
	     , attributes
	     , order=[['id', 'DESC']]){

		page = parse(page, 1);
		size = parse(size, 20);
		filter = filter ? filter.split(',') : [];

		let whereSearch = search ? {
				...where.or([
					where.like({
						'content.title': `%${search}%`
					})
					, where.like({
						'content.content': `%${search}%`
					})
					, where.like({
						'content.desc': `%${search}%`
					})
					, where.like({
						'content.tags': `%${search}%`
					})
					, where.like({
						'content.contents': `%${search}%`
					})
				])
			} : {}
			;

		return News.findAll({
			where: {
				...whereSearch
				, ...where.in({
					type: filter
				})
				, ...where.eq({
					type
					, status
					, creatorId
				})
			}
			, offset: (page -1)* size
			, limit: size
			, attributes
			, order
		});
	}
	, count({type, status, creatorId}){
		return News.count({
			where: {
				...where.eq({
					type
					, status
					, creatorId
				})
			}
		});
	}
	, get({id, creatorId, status}, attributes){
		return News.findOne({
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
	, create({type, targetId, content}){
		return News.create({
			type
			, targetId
			, content
		});
	}
	, update({id, type, targetId, content}){
		return News.update({
			type
			, targetId
			, content
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
	, news({search, filter, page, size}){
		return this.list({
			status: 1
			, creatorId: 1
			, search
			, filter
			, page
			, size
		}, [
			'id'
			, 'type'
			, 'targetId'
			, 'content'
			, 'weight'
			, 'password'
			, 'createDate'
			, 'updateDate'
		], [
			['weight', 'DESC']
			, [literal('case when type=\'blog\' then update_datetime else create_datetime end'), 'DESC']
		]);
	}
	, changeStatus({status, id}){
		if( !id ){
			return Promise.reject( new Error('缺少 id') );
		}

		status = parse(status, 1);

		status = +!status;

		return News.update({
			status
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
	, changePublish({createDate, id}){
		if( !id ){
			return Promise.reject( new Error('缺少 id') );
		}

		try{
			let d = new Date( createDate )
		}
		catch(e){
			return Promise.reject( new Error('错误的时间格式') );
		}

		return News.update({
			createDate
		}, {
			where: {
				...where.eq({
					id
				})
			}
		})
	}
	, weight({id, weight=0}){
		return News.update({
			weight
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
};