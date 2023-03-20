import {where, parse}               from '../db.js';
import {Document, Section, Content} from './model.js';

const document = {
		list({title, creatorId, page, size}){
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
				, order: [
					['id', 'DESC']
				]
				, offset: (page-1) * size
				, limit: size
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
		, get({id, creatorId}){
			return Document.findOne({
				where: {
					...where.eq({
						id
						, creatorId
					})
				}
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
			})
		}
		, document({id, creatorId}){
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
				}]
			});
		}
	}
	, section = {
		list({documentId, title, creatorId, page, size}){
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
				}]
				, order: [
					['id', 'DESC']
				]
				, offset: (page-1) * size
				, limit: size
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
		, get({id, creatorId}){
			return Section.findOne({
				where: {
					...where.eq({
						id
						, creatorId
					})
				}
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
			})
		}
	}
	, content = {
		list({documentId, sectionId, title, creatorId, page, size}){
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
				}, {
					model: Section
					, as: 'section'
				}]
				, order: [
					['id', 'DESC']
				]
				, offset: (page -1) * size
				, limit: size
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
		, get({id, creatorId}){
			return Content.findOne({
				where: {
					...where.eq({
						id
						, creatorId
					})
				}
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