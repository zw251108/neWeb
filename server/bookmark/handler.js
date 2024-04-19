import {where, parse, where as wheree}       from '../db.js';
import {Bookmark, UserBookmark, Reader, Web} from './model.js';
import News                                  from '../news/model.js';

const bookmark = {
		list({title, score, tags, userId, status, page = 1, size = 20}
			, attributes
			, order = [['id', 'DESC']]
			, bookmarkAttr = ['id', 'title', 'url']
			, webAttr = ['url', 'ico']){

			page = parse(page, 1);
			size = parse(size, 20);

			return UserBookmark.findAll({
				where: {
					...where.eq({
						userId
						, status
						, score
					})
					, ...where.like({
						title
					})
					, ...where.like({
						tags
					})
				}
				, offset: (page - 1) * size
				, limit: size
				, attributes
				, order
				, include: [{
					model: Bookmark
					, as: 'bookmark'
					, attributes: bookmarkAttr
					, include: [{
						model: Web
						, as: 'web'
						, attributes: webAttr
					}]
				}]
			});
		}
		, count({title, score, tags, userId, status}){
			return UserBookmark.count({
				where: {
					...where.eq({
						userId
						, status
						, score
					})
					, ...where.like({
						title
					})
					, ...where.like({
						tags
					})
				}
			});
		}
		, edit({id, title, tags}){
			return UserBookmark.update({
				title
				, tags
			}, {
				where: {
					...wheree.eq({
						id
					})
				}
			});
		}
		, read({id, title, score, tags}){
			score = parse(score, 0);
			
			return UserBookmark.update({
				title
				, score
				, tags
				, status: 1
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
		, share({id, bookmarkId, title, url, score, tags, readDate}){
			score = parse(score, 0);
	
			return Promise.all([
				UserBookmark.update({
					status: 2
				}, {
					where: {
						...where.eq({
							id
						})
					}
				})
				, News.findCreateFind({
					where: {
						targetId: id
						, type: 'bookmark'
					}
				}).then(([news])=>{
					news.content = {
						title
						, url
						, score
						, bookmarkId
						, tags: tags ? tags.split(',') : []
					};
					news.createDate = readDate;
					news.status = 1;
					news.creatorId = 1;

					return news.save();
				})
			]);
		}
		, retract({id}){
			return Promise.all([
				UserBookmark.update({
					status: 1
				}, {
					where: {
						...where.eq({
							id
						})
					}
				})
				, News.update({
					status: 0
				}, {
					where: {
						...where.eq({
							targetId: id
							, type: 'bookmark'
						})
					}
				})
			]);
		}
	}
	, reader = {
		list({name, htmlUrl, tags, creatorId, status, page=1, size=20}
			, attributes
			, order=[['id', 'DESC']]
			, webAttr=['url', 'ico']){

			page = parse(page, 1);
			size = parse(size, 20);

			return Reader.findAll({
				where: {
					...where.eq({
						creatorId
						, status
					})
					, ...where.or([
						where.like({
							name
						})
						, where.like({
							htmlUrl: name
						})
					])
					, ...where.like({
						htmlUrl
					})
					, ...where.like({
						tags
					})
				}
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
				, include: [{
					model: Web
					, as: 'web'
					, attributes: webAttr
				}]
			});
		}
		, count({name, htmlUrl, tags, creatorId, status}){
			return Reader.count({
				where: {
					...where.eq({
						creatorId
						, status
					})
					, ...where.or([
						where.like({
							name
						})
						, where.like({
							htmlUrl: name
						})
					])
					, ...where.like({
						htmlUrl
					})
					, ...where.like({
						tags
					})
				}
			});
		}
	}
	;

export default {
	bookmark
	, reader
};

export {
	bookmark
	, reader
};