import db   from '../db.js';
import Tag  from './model.js';

export default {
	list(){
		return Tag.findAll();
	}
	, create(data){
		return Tag.create( data );
	}
	, increase(tag, num=1){
		return Tag.update({
			num: db.literal(`num+${num}`)
		}, {
			where: {
				name: 'test'
			}
		});
	}
};