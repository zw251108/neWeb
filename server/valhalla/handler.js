import {where, parse} from '../db.js';
import Valhalla       from './model.js';
import Image          from '../image/model.js';

export default {
	list({page, size}, attributes, order){
		page = parse(page, 1);
		size = parse(size, 50);

		return Valhalla.findAll({
			where: {
				
			}
			, offset: (page -1)* size
			, limit: size
			, attributes
			, order
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

	, all({page, size}, attributes, order, imageAttr){
		return Valhalla.findAll({
			// include: [{
			// 	model: Image
			// 	, attributes: imageAttr
			// 	, through: {
			// 		attributes: []
			// 	}
			// }]
			// ,
			attributes
			, order
		});
	}
};