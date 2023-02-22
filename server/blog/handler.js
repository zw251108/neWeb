import Blog from './model.js';

export default {
	list(where, page=1, size=20){
		return Blog.findAll({
			attributes: ['id', 'title', 'updateDate']
			, where
			, order: [
				['id', 'DESC']
			]
			, offset: (page -1)* size
			, limit: size
		});
	}
	, get(where){
		return Blog.findOne({
			where
		});
	}
	, create(data){
		return Blog.create( data );
	}
	, update(data, where){
		return Blog.update(data, {
			where
		});
	}
	, del(){
		
	}
};