import {Bookmark, Reader} from './model.js';

export default {
	list(where, page=1, size=20){
		return Bookmark.findAll({
			attributes: []
			, where
			, order: [
				['id', 'DESC']
			]
			, offset: (page -1)* size
			, limit: size
		});
	}
	, get(where){

	}
	, create(data){
		return Bookmark.create( data );
	}
	, update(data){

	}
	, del(){

	}
	, read(data){

	}
};