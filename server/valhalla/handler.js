import {where, parse} from '../db.js';
import Valhalla       from './model.js';

export default {
	list({page, size}){
		page = parse(page, 1);
		size = parse(size, 50);

		return Valhalla.findAll({
			attributes: ['id', 'name', 'path', 'start', 'end', 'description', 'weight']
			, where: {
				
			}
			, order: [
				['weight', 'DESC']
				, ['id', 'ASC']
			]
			, offset: (page -1)* size
			, limit: size
		});
	}
	, count(){
		return Valhalla.count({
			where: {

			}
		})
	}
	, create({name, path, start, end, description, weight}){
		return Valhalla.create({
			name
			, path
			, start
			, end
			, description
			, weight
		});
	}
	, update({id, name, path, start, end, description, weight}){
		return Valhalla.update({
			name
			, path
			, start
			, end
			, description
			, weight
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
};