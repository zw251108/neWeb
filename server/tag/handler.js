import db, {Op}           from '../db.js';
import {Tag, ContentTag}  from './model.js';

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
	, contentTag(ids, type){
		return ContentTag.findAll({
			where: {
				contentId: {
					[Op.in]: ids
				}
				, type
			}
		});
	}
};