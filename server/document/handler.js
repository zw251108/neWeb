import {where, parse}               from '../db.js';
import {Document, Section, Content} from './model.js';

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
		, get({id, creatorId}, attributes, sectionAttr){
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
				}]
				, attributes
			});
		}
		, create({title}){
			return Document.create({
				title
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
		     , documentAttr=['id', 'title']){

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
			return Document.count({
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
		, get({id, creatorId}, attributes, contentAttr){
			return Section.findOne({
				where: {
					...where.eq({
						id
						, creatorId
					})
				}
				, include: [{
					model: Content
					, as: 'content'
					, attributes: contentAttr
				}]
				, attributes
			});
		}
		, create({title, documentId}){
			return Section.create({
				title
				, documentId
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
	}
	, content = {
		list({documentId, sectionId, title, creatorId, page, size}
		     , attributes
		     , order=[['id', 'DESC']]
		     , documentAttr=['id', 'title']
		     , sectionAttr=['id', 'title']){

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
		, get({id, creatorId}, attributes){
			return Content.findOne({
				where: {
					...where.eq({
						id
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