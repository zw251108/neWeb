import Valhalla from './model.js';

export default {
	list(where, page=1, size=50){
		return Valhalla.findAll({
			attributes: ['id', 'name', 'path', 'start', 'end', 'description', 'weight']
			, where
			, order: [
				['id', 'DESC']
			]
			, offset: (page -1)* size
			, limit: size
		});
	}
	, create(data){
		return Valhalla.create( data );
	}
	, update(data, where){
		return Valhalla.update(data, {
			where
		});
	}
	, del(){
		
	}
};