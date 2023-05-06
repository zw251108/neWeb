import {where}   from '../db.js';
import SysConfig from './model.js';

export default {
	get({id, name}, attributes){
		return SysConfig.findOne({
			where: {
				...where.eq({
					id
				})
				, ...where.eq({
					name
				})
			}
			, attributes
		});
	}
	, update({id, name, config, description}){
		return SysConfig.update({
			name
			, config
			, description
		}, {
			where: {
				...where.eq({
					id
				})
			}
		});
	}
};