import News from './model.js';

export default {
	list(where, page=1, size=20){
		try{
			page = JSON.parse( page );
		}
		catch(e){}

		try{
			size = JSON.parse( size );
		}
		catch(e){}

		return News.findAll({
			attributes: ['id', 'type', 'targetId', 'content', 'createDate']
			, where
			, order: [
				['createDate', 'DESC']
			]
			, offset: (page -1)* size
			, limit: size
		});
	}
	, create(data){
		return News.create( data );
	}
};