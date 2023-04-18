import {where, parse}               from '../db.js';
import {Document, Section, Content} from './model.js';
import News                         from '../news/model.js';

const document = {
		list({title, creatorId, page, size}
		     , attributes
		     , order=[['id', 'DESC']]){

			page = parse(page, 1);
			size = parse(size, 20);

			return Document.findAll({
				where: {
					...where.eq({
						creatorId
					})
					, ...where.like({
						title
					})
				}
				, offset: (page-1) * size
				, limit: size
				, attributes
				, order
			});
		}
		, count({title, creatorId}){
			return Document.count({
				where: {
					...where.eq({
						creatorId
					})
					, ...where.like({
						title
					})
				}
			});
		}
		, get({id, creatorId, status}, attributes, sectionAttr, sectionWhere={}){
			return Document.findOne({
				where: {
					...where.eq({
						id
						, status
						, creatorId
					})
				}
				, include: [{
					model: Section
					, as: 'section'
					, attributes: sectionAttr
					, where: {
						...where.eq( sectionWhere )
					}
				}]
				, attributes
			});
		}
		, create({title}){
			return Document.create({
				title
				, creatorId: 1
			}).then((data)=>{
				return News.create({
					targetId: data.id
					, type: 'doc'
					, content: {
						title
						, content: []
					}
					, creatorId: 1
				}).then(()=>{
					return data;
				});
			});
		}
		, update({id, title}){
			return Document.update({
				title
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
		, sort({id, sectionOrder}){
			return Document.update({
				sectionOrder
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
		, changeStatus({status, id}){
			if( !id ){
				return Promise.reject( new Error('缺少 id') );
			}

			status = parse(status, 1);

			status = +!status;

			return Document.update({
				status
			}, {
				where: {
					...where.eq({
						id
					})
				}
			}).then(()=>{
				return News.update({
					status
				}, {
					where: {
						...where.eq({
							targetId: id
							, type: 'doc'
						})
					}
				});
			});
		}
		, document({id, creatorId}
		           , attributes=['id', 'title', 'sectionOrder']
		           , sectionAttr=['id', 'title', 'contentOrder']
		           , contentAttr=['id', 'title', 'content']){

			return Document.findOne({
				where: {
					...where.eq({
						id
						, creatorId
					})
				}
				, include: [{
					model: Section
					, as: 'section'
					, attributes: sectionAttr
					, include: [{
						model: Content
						, as: 'content'
						, attributes: contentAttr
					}]
				}]
				, attributes
			});
		}
	}
	, section = {
		list({documentId, title, creatorId, page, size}
		     , attributes
		     , order=[['id', 'DESC']]
		     , documentAttr=['id', 'title', 'sectionOrder']){

			page = parse(page, 1);
			size = parse(size, 20);

			return Section.findAll({
				where: {
					...where.eq({
						documentId
						, creatorId
					})
					, ...where.like({
						title
					})
				}
				, include: [{
					model: Document
					, as: 'document'
					, attributes: documentAttr
				}]
				, offset: (page-1) * size
				, limit: size
				, attributes
				, order
			});
		}
		, count({documentId, title, creatorId}){
			return Section.count({
				where: {
					...where.eq({
						documentId
						, creatorId
					})
					, ...where.like({
						title
					})
				}
			});
		}
		, get({id, status, creatorId}, attributes, contentAttr, contentWhere={}){
			return Section.findOne({
				where: {
					...where.eq({
						id
						, status
						, creatorId
					})
				}
				, include: [{
					model: Content
					, as: 'content'
					, attributes: contentAttr
					, where: {
						...where.eq( contentWhere )
					}
				}]
				, attributes
			});
		}
		, create({title, documentId}){
			return Section.create({
				title
				, documentId
				, creatorId: 1
			});
		}
		, update({id, title, documentId}){
			return Section.update({
				title
				, documentId
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
		, sort({id, contentOrder}){
			return Section.update({
				contentOrder
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
		, changeStatus({status, id}){
			if( !id ){
				return Promise.reject( new Error('缺少 id') );
			}

			status = parse(status, 1);

			status = +!status;

			return Section.update({
				status
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	, content = {
		list({documentId, sectionId, title, creatorId, page, size}
		     , attributes
		     , order=[['id', 'DESC']]
		     , documentAttr=['id', 'title']
		     , sectionAttr=['id', 'title', 'contentOrder']){

			page = parse(page, 1);
			size = parse(size, 20);

			return Content.findAll({
				where: {
					...where.eq({
						documentId
						, sectionId
						, creatorId
					})
					, ...where.like({
						title
					})
				}
				, include: [{
					model: Document
					, as: 'document'
					, attributes: documentAttr
				}, {
					model: Section
					, as: 'section'
					, attributes: sectionAttr
				}]
				, offset: (page -1) * size
				, limit: size
				, attributes
				, order
			});
		}
		, count({documentId, sectionId, title, creatorId}){
			return Content.count({
				where: {
					...where.eq({
						documentId
						, sectionId
						, creatorId
					})
					, ...where.like({
						title
					})
				}
			});
		}
		, get({id, status, creatorId}, attributes){
			return Content.findOne({
				where: {
					...where.eq({
						id
						, status
						, creatorId
					})
				}
				, attributes
			});
		}
		, create({title, content, documentId, sectionId}){
			return Content.create({
				title
				, content
				, documentId
				, sectionId
				, creatorId: 1
			});
		}
		, update({id, title, content, documentId, sectionId}){
			return Content.update({
				title
				, content
				, documentId
				, sectionId
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
		, changeStatus({status, id}){
			if( !id ){
				return Promise.reject( new Error('缺少 id') );
			}

			status = parse(status, 1);

			status = +!status;

			return Content.update({
				status
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	;
export default {
	document
	, section
	, content
};

export {
	document
	, section
	, content
};