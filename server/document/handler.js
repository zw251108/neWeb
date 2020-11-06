import {Document, Section, Content} from './model.js';

export default {
	list(where, page=1, size=10){
		return Document.findAll({
			where
			, offset: (page-1) * size
			, limit: size
		});
	}
	, document(where){
		return Document.findOne({
			where
			, include: [{
				model: Section
				, as: 'section'
			}]
		});
	}
	, sectionList(where, page=1, size=10){
		return Section.findAll({
			where
			, offset: (page-1) * size
			, limit: size
		});
	}
	, updateSection(){}
	, contentList(where, page=1, size=10){
		return Content.findAll({
			where
			, offset: (page -1) * size
			, limit: size
		});
	}
	, get(where){
		return Content.findOne({
			where
		});
	}
	, updateContent(){

	}
};